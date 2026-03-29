import Configuration from './Configuration';

export default class ConfigurationValidator {
  public static validate(config: Configuration): Error | null {
    if (typeof config.refresh !== 'number') {
      return new Error('Refresh value must be a number.');
    }

    if (!config.selector || typeof config.selector !== 'string') {
      return new Error('Selector must be a non-empty string.');
    }

    for (let i = 0; i < config.rules.length; i++) {
      const rule = config.rules[i];
      if (typeof rule.condition !== 'function' || !rule.text || typeof rule.text !== 'object') {
        return new Error(`Rule at index ${i} must have a condition function and a text object.`);
      }
    }

    return null;
  }
}
