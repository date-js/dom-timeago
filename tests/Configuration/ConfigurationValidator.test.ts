import Configuration from '../../src/Configuration/Configuration';
import ConfigurationValidator from '../../src/Configuration/ConfigurationValidator';

describe('ConfigurationValidator', () => {
  it('returns null for a valid configuration', () => {
    const config = new Configuration();
    expect(ConfigurationValidator.validate(config)).toBeNull();
  });

  it('returns an error if refresh is not a number', () => {
    const config = new Configuration();
    (config as unknown as Record<string, unknown>).refresh = 'five';
    const error = ConfigurationValidator.validate(config);
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toMatch(/refresh/i);
  });

  it('returns an error if selector is empty', () => {
    const config = new Configuration();
    config.selector = '';
    const error = ConfigurationValidator.validate(config);
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toMatch(/selector/i);
  });

  it('returns an error if selector is not a string', () => {
    const config = new Configuration();
    (config as unknown as Record<string, unknown>).selector = 42;
    const error = ConfigurationValidator.validate(config);
    expect(error).toBeInstanceOf(Error);
  });

  it('returns an error if a rule has no condition', () => {
    const config = new Configuration();
    config.rules = [{ text: { en: 'test' } } as never];
    const error = ConfigurationValidator.validate(config);
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toMatch(/rule at index 0/i);
  });

  it('returns an error if a rule has no text', () => {
    const config = new Configuration();
    config.rules = [{ condition: () => true } as never];
    const error = ConfigurationValidator.validate(config);
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toMatch(/rule at index 0/i);
  });

  it('returns null if all rules are valid', () => {
    const config = new Configuration();
    config.rules = [{ condition: () => true, text: { en: 'test' } }];
    expect(ConfigurationValidator.validate(config)).toBeNull();
  });
});
