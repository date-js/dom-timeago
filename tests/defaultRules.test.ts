import DateInterval from '../src/DateInterval/DateInterval';
import defaultRules from '../src/defaultRules';
import RuleTemplateParser from '../src/Rule/RuleTemplateParser';

const makeInterval = (date: Date, day = 0, hour = 0, minute = 0, second = 0): DateInterval =>
  new DateInterval(date, day, hour, minute, second);

const now = new Date();
const yesterday = new Date(now.getTime() - 86400 * 1000);
const twoDaysAgo = new Date(now.getTime() - 2 * 86400 * 1000);
const lastYear = new Date(now.getFullYear() - 1, 5, 15);
const twoYearsAgo = new Date(now.getFullYear() - 2, 5, 15);

describe('defaultRules — conditions', () => {
  it('justNow: matches 0d 0h 0m 10s', () => {
    expect(defaultRules[0].condition(makeInterval(now, 0, 0, 0, 10))).toBe(true);
  });

  it('justNow: does not match after 30s', () => {
    expect(defaultRules[0].condition(makeInterval(now, 0, 0, 0, 35))).toBe(false);
  });

  it('someSeconds: matches 0d 0h 0m 45s', () => {
    expect(defaultRules[1].condition(makeInterval(now, 0, 0, 0, 45))).toBe(true);
  });

  it('someSeconds: does not match when minutes > 0', () => {
    expect(defaultRules[1].condition(makeInterval(now, 0, 0, 1, 0))).toBe(false);
  });

  it('someMinutes: matches 0d 0h 5m 0s', () => {
    expect(defaultRules[2].condition(makeInterval(now, 0, 0, 5, 0))).toBe(true);
  });

  it('someMinutes: does not match when hours > 0', () => {
    expect(defaultRules[2].condition(makeInterval(now, 0, 1, 0, 0))).toBe(false);
  });

  it('someHours: matches 0d 3h', () => {
    expect(defaultRules[3].condition(makeInterval(now, 0, 3, 0, 0))).toBe(true);
  });

  it('someHours: does not match when hours >= 12', () => {
    expect(defaultRules[3].condition(makeInterval(now, 0, 12, 0, 0))).toBe(false);
  });

  it('today: matches today\'s date', () => {
    expect(defaultRules[4].condition(makeInterval(now))).toBe(true);
  });

  it('today: does not match yesterday', () => {
    expect(defaultRules[4].condition(makeInterval(yesterday))).toBe(false);
  });

  it('yesterday: matches yesterday\'s date', () => {
    expect(defaultRules[5].condition(makeInterval(yesterday))).toBe(true);
  });

  it('yesterday: does not match today', () => {
    expect(defaultRules[5].condition(makeInterval(now))).toBe(false);
  });

  it('someDays: matches 3 days ago', () => {
    expect(defaultRules[6].condition(makeInterval(twoDaysAgo, 3, 0, 0, 0))).toBe(true);
  });

  it('someDays: does not match 0 days', () => {
    expect(defaultRules[6].condition(makeInterval(now, 0, 0, 0, 0))).toBe(false);
  });

  it('someDays: does not match 7 days or more', () => {
    expect(defaultRules[6].condition(makeInterval(twoDaysAgo, 7, 0, 0, 0))).toBe(false);
  });

  it('sameYear: matches a date in the current year', () => {
    const thisYear = new Date(now.getFullYear(), 0, 1);
    expect(defaultRules[7].condition(makeInterval(thisYear))).toBe(true);
  });

  it('sameYear: does not match last year', () => {
    expect(defaultRules[7].condition(makeInterval(lastYear))).toBe(false);
  });

  it('otherwise: always matches', () => {
    expect(defaultRules[8].condition(makeInterval(twoYearsAgo))).toBe(true);
  });
});

describe('defaultRules — available locales', () => {
  it('every rule has both en and fr locale texts', () => {
    defaultRules.forEach((rule) => {
      expect(rule.text).toHaveProperty('en', expect.any(String));
      expect(rule.text).toHaveProperty('fr', expect.any(String));
    });
  });
});

describe('defaultRules — locale plural forms', () => {
  const render = (ruleIndex: number, locale: string, interval: DateInterval): string =>
    RuleTemplateParser.parse((defaultRules[ruleIndex].text as Record<string, string>)[locale], interval, locale);
  const seconds = (locale: string, n: number) => render(1, locale, makeInterval(now, 0, 0, 0, n));
  const minutes = (locale: string, n: number) => render(2, locale, makeInterval(now, 0, 0, n, 0));
  const hours = (locale: string, n: number) => render(3, locale, makeInterval(now, 0, n, 0, 0));

  it('ru: uses one / few / many noun forms', () => {
    expect(seconds('ru', 31)).toBe('31 секунду назад');
    expect(seconds('ru', 42)).toBe('42 секунды назад');
    expect(seconds('ru', 45)).toBe('45 секунд назад');
    expect(minutes('ru', 1)).toBe('1 минуту назад');
    expect(minutes('ru', 2)).toBe('2 минуты назад');
    expect(minutes('ru', 21)).toBe('21 минуту назад');
    expect(minutes('ru', 11)).toBe('11 минут назад');
    expect(hours('ru', 1)).toBe('1 час назад');
    expect(hours('ru', 2)).toBe('2 часа назад');
    expect(hours('ru', 5)).toBe('5 часов назад');
  });

  it('ar: uses singular, dual, plural (3-10) and 11+ forms', () => {
    expect(minutes('ar', 1)).toBe('منذ دقيقة');
    expect(minutes('ar', 2)).toBe('منذ دقيقتين');
    expect(minutes('ar', 5)).toBe('منذ 5 دقائق');
    expect(minutes('ar', 21)).toBe('منذ 21 دقيقة');
    expect(hours('ar', 1)).toBe('منذ ساعة');
    expect(hours('ar', 2)).toBe('منذ ساعتين');
    expect(hours('ar', 5)).toBe('منذ 5 ساعات');
    expect(hours('ar', 11)).toBe('منذ 11 ساعة');
    expect(seconds('ar', 45)).toBe('منذ 45 ثانية');
  });

  it('mr / sw / ta / te / ur: use the singular form for 1', () => {
    expect(minutes('mr', 1)).toBe('1 मिनिटापूर्वी');
    expect(minutes('mr', 5)).toBe('5 मिनिटांपूर्वी');
    expect(hours('sw', 1)).toBe('saa 1 iliyopita');
    expect(hours('sw', 5)).toBe('masaa 5 yaliyopita');
    expect(minutes('sw', 1)).toBe('dakika 1 iliyopita');
    expect(minutes('ta', 1)).toBe('1 நிமிடத்திற்கு முன்');
    expect(hours('te', 1)).toBe('1 గంట క్రితం');
    expect(hours('te', 3)).toBe('3 గంటల క్రితం');
    expect(hours('ur', 1)).toBe('1 گھنٹہ پہلے');
    expect(hours('ur', 4)).toBe('4 گھنٹے پہلے');
  });
});
