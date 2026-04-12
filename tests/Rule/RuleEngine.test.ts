import DateInterval from '../../src/DateInterval/DateInterval';
import RuleEngine from '../../src/Rule/RuleEngine';
import Rule from '../../src/Rule/Rule';

const makeInterval = (day = 0, hour = 0, minute = 0, second = 0): DateInterval =>
  new DateInterval(new Date(), day, hour, minute, second);

describe('RuleEngine', () => {
  const engine = new RuleEngine();

  const rules: Rule[] = [
    { condition: (i) => i.second < 30, text: { en: 'just now' }, refresh: undefined },
    { condition: (i) => i.minute > 0, text: { en: '%dm minutes ago' }, refresh: 30 },
    { condition: () => true, text: { en: 'a long time ago' }, refresh: null },
  ];

  it('returns null when no rules are provided', () => {
    const result = engine.render([], makeInterval(), 'en');
    expect(result).toBeNull();
  });

  it('renders the text of the first matching rule', () => {
    const result = engine.render(rules, makeInterval(0, 0, 0, 10), 'en');
    expect(result?.render).toBe('just now');
  });

  it('sets nextUpdate to undefined when refresh is undefined', () => {
    const result = engine.render(rules, makeInterval(0, 0, 0, 10), 'en');
    expect(result?.nextUpdate).toBeUndefined();
  });

  it('sets nextUpdate to null when refresh is null', () => {
    // second=35 >= 30 → rule 0 does not match; minute=0 → rule 1 does not match; rule 2 (otherwise) matches
    const result = engine.render(rules, makeInterval(0, 0, 0, 35), 'en');
    expect(result?.nextUpdate).toBeNull();
  });

  it('sets nextUpdate to a future Date when refresh is a number', () => {
    const now = Date.now();
    // second=35 >= 30 → rule 0 does not match; minute=5 > 0 → rule 1 matches (refresh=30)
    const result = engine.render(rules, makeInterval(0, 0, 5, 35), 'en');
    expect(result?.nextUpdate).toBeInstanceOf(Date);
    expect((result?.nextUpdate as Date).getTime()).toBeGreaterThanOrEqual(now + 30 * 1000 - 50);
    expect((result?.nextUpdate as Date).getTime()).toBeLessThanOrEqual(now + 30 * 1000 + 50);
  });

  it('returns null when the locale is not available for the matching rule', () => {
    const result = engine.render(rules, makeInterval(0, 0, 0, 10), 'de');
    expect(result).toBeNull();
  });
});
