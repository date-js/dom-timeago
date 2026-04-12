import DateInterval from '../../src/DateInterval/DateInterval';
import RuleTemplateParser from '../../src/Rule/RuleTemplateParser';

const makeInterval = (date: Date, day = 0, hour = 0, minute = 0, second = 0): DateInterval =>
  new DateInterval(date, day, hour, minute, second);

describe('RuleTemplateParser', () => {
  describe('diff variable interpolation', () => {
    it('replaces %dd with the number of days', () => {
      const interval = makeInterval(new Date(), 3, 0, 0, 0);
      expect(RuleTemplateParser.parse('%dd days', interval, 'en')).toBe('3 days');
    });

    it('replaces %dh with the number of hours', () => {
      const interval = makeInterval(new Date(), 0, 5, 0, 0);
      expect(RuleTemplateParser.parse('%dh hours', interval, 'en')).toBe('5 hours');
    });

    it('replaces %dm with the number of minutes', () => {
      const interval = makeInterval(new Date(), 0, 0, 42, 0);
      expect(RuleTemplateParser.parse('%dm minutes', interval, 'en')).toBe('42 minutes');
    });

    it('replaces %ds with the number of seconds', () => {
      const interval = makeInterval(new Date(), 0, 0, 0, 15);
      expect(RuleTemplateParser.parse('%ds seconds', interval, 'en')).toBe('15 seconds');
    });
  });

  describe('pluralisation {%var|singular|plural}', () => {
    // The singular condition is <= 1, so both 0 and 1 use the singular form
    it('uses the singular form for 1', () => {
      const interval = makeInterval(new Date(), 0, 0, 1, 0);
      expect(RuleTemplateParser.parse('%dm minute{%dm||s}', interval, 'en')).toBe('1 minute');
    });

    it('uses the plural form for values greater than 1', () => {
      const interval = makeInterval(new Date(), 0, 0, 5, 0);
      expect(RuleTemplateParser.parse('%dm minute{%dm||s}', interval, 'en')).toBe('5 minutes');
    });

    it('uses the singular form for 0', () => {
      const interval = makeInterval(new Date(), 0, 0, 0, 0);
      expect(RuleTemplateParser.parse('%ds second{%ds||s}', interval, 'en')).toBe('0 second');
    });

    it('uses the singular suffix — %d is zero-padded', () => {
      const interval = makeInterval(new Date('2024-01-01'), 0, 0, 0, 0);
      const result = RuleTemplateParser.parse('le %d{%d|er|}', interval, 'fr');
      expect(result).toBe('le 01er');
    });
  });

  describe('date variables via DateFormatter', () => {
    it('replaces %H and %i with zero-padded time parts', () => {
      const date = new Date('2024-06-15T08:05:00.000Z');
      const interval = makeInterval(date);
      const result = RuleTemplateParser.parse('%H:%i', interval, 'en');
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('edge cases', () => {
    it('leaves an unknown symbol untouched', () => {
      const interval = makeInterval(new Date(), 0, 0, 0, 0);
      expect(RuleTemplateParser.parse('%unknownsymbol', interval, 'en')).toBe('%unknownsymbol');
    });

    it('handles an empty template', () => {
      const interval = makeInterval(new Date(), 0, 0, 0, 5);
      expect(RuleTemplateParser.parse('', interval, 'en')).toBe('');
    });
  });
});
