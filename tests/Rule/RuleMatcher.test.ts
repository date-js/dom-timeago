import DateInterval from '../../src/DateInterval/DateInterval';
import RuleMatcher from '../../src/Rule/RuleMatcher';
import Rule from '../../src/Rule/Rule';

const makeInterval = (day = 0, hour = 0, minute = 0, second = 0): DateInterval =>
  new DateInterval(new Date(), day, hour, minute, second);

describe('RuleMatcher', () => {
  const rules: Rule[] = [
    { condition: (i) => i.second < 30, text: { en: 'just now', fr: 'à l\'instant' } },
    { condition: (i) => i.minute > 0, text: { en: '%dm ago', fr: 'il y a %dm' } },
  ];

  it('returns the first matching rule', () => {
    const interval = makeInterval(0, 0, 0, 10);
    const rule = RuleMatcher.find(rules, interval, 'en');
    expect(rule).toBe(rules[0]);
  });

  it('returns null when no rule condition matches', () => {
    const interval = makeInterval(0, 0, 0, 45);
    const rule = RuleMatcher.find(rules, interval, 'en');
    expect(rule).toBeNull();
  });

  it('returns null when the locale is not present in the matching rule text', () => {
    const interval = makeInterval(0, 0, 0, 10);
    const rule = RuleMatcher.find(rules, interval, 'de');
    expect(rule).toBeNull();
  });

  it('skips the first rule and returns the second when only the second matches', () => {
    const interval = makeInterval(0, 0, 5, 45);
    const rule = RuleMatcher.find(rules, interval, 'en');
    expect(rule).toBe(rules[1]);
  });

  it('returns null for an empty rules array', () => {
    const interval = makeInterval(0, 0, 0, 10);
    expect(RuleMatcher.find([], interval, 'en')).toBeNull();
  });
});
