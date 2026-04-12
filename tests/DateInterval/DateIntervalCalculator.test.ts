import DateIntervalCalculator from '../../src/DateInterval/DateIntervalCalculator';

describe('DateIntervalCalculator', () => {
  const now = new Date('2024-06-15T12:00:00.000Z').getTime();

  it('returns all zeros for a date equal to now', () => {
    const date = new Date(now);
    const interval = DateIntervalCalculator.getDateInterval(date, now);
    expect(interval.day).toBe(0);
    expect(interval.hour).toBe(0);
    expect(interval.minute).toBe(0);
    expect(interval.second).toBe(0);
  });

  it('correctly computes seconds', () => {
    const date = new Date(now - 45 * 1000);
    const interval = DateIntervalCalculator.getDateInterval(date, now);
    expect(interval.day).toBe(0);
    expect(interval.hour).toBe(0);
    expect(interval.minute).toBe(0);
    expect(interval.second).toBe(45);
  });

  it('correctly computes minutes and remaining seconds', () => {
    const date = new Date(now - (3 * 60 + 20) * 1000);
    const interval = DateIntervalCalculator.getDateInterval(date, now);
    expect(interval.day).toBe(0);
    expect(interval.hour).toBe(0);
    expect(interval.minute).toBe(3);
    expect(interval.second).toBe(20);
  });

  it('correctly computes hours and remaining minutes', () => {
    const date = new Date(now - (2 * 3600 + 30 * 60) * 1000);
    const interval = DateIntervalCalculator.getDateInterval(date, now);
    expect(interval.day).toBe(0);
    expect(interval.hour).toBe(2);
    expect(interval.minute).toBe(30);
    expect(interval.second).toBe(0);
  });

  it('correctly computes days and remaining hours', () => {
    const date = new Date(now - (3 * 86400 + 5 * 3600) * 1000);
    const interval = DateIntervalCalculator.getDateInterval(date, now);
    expect(interval.day).toBe(3);
    expect(interval.hour).toBe(5);
    expect(interval.minute).toBe(0);
    expect(interval.second).toBe(0);
  });

  it('preserves the original date reference', () => {
    const date = new Date(now - 60000);
    const interval = DateIntervalCalculator.getDateInterval(date, now);
    expect(interval.date).toBe(date);
  });
});
