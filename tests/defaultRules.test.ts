import DateInterval from '../src/DateInterval/DateInterval';
import defaultRules from '../src/defaultRules';

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
