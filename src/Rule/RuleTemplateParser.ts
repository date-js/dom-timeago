import DateFormatter from '@date-js/date-formatter';
import DateInterval from '../DateInterval/DateInterval';

const NAMED_BRANCH = /^(zero|one|two|few|many|other):/;
const pluralRulesCache = new Map<string, Intl.PluralRules>();

export default class RuleTemplateParser {
  public static parse(text: string, diff: DateInterval, locale: string): string {
    const withPlurals = RuleTemplateParser.resolvePlurals(text, diff, locale);
    const withVariables = RuleTemplateParser.interpolateVariables(withPlurals, diff, locale);
    return withVariables.replace('\\', '');
  }

  /**
   * Two syntaxes are supported:
   * - positional: `{%dm|singular|plural}` — singular when the value is <= 1
   * - named: `{%dm|one:…|few:…|other:…}` — branch picked from the locale's
   *   plural category (Intl.PluralRules), falling back to `other`
   */
  private static resolvePlurals(text: string, diff: DateInterval, locale: string): string {
    const regexp = /{%([a-z]+)((?:\|[^|{}\[\]]*)+)}/gi;
    return text.replace(regexp, (match, symbol: string, rawBranches: string) => {
      const branches = rawBranches.slice(1).split('|');
      const named = branches.every(branch => NAMED_BRANCH.test(branch));
      if (!named && branches.length !== 2) {
        return match;
      }

      const value = RuleTemplateParser.getValueFromSymbol(symbol, diff, locale);
      if (value === null) {
        return '';
      }
      const count = parseInt(value, 10);

      if (!named) {
        return count <= 1 ? branches[0] : branches[1];
      }

      const forms: Record<string, string> = {};
      branches.forEach(branch => {
        const separator = branch.indexOf(':');
        forms[branch.slice(0, separator)] = branch.slice(separator + 1);
      });
      const category = RuleTemplateParser.getPluralCategory(count, locale);
      return forms[category] ?? forms.other ?? '';
    });
  }

  private static getPluralCategory(count: number, locale: string): string {
    if (typeof Intl === 'undefined' || typeof Intl.PluralRules === 'undefined') {
      // Legacy behaviour for browsers without Intl.PluralRules
      return count <= 1 ? 'one' : 'other';
    }
    try {
      let rules = pluralRulesCache.get(locale);
      if (!rules) {
        rules = new Intl.PluralRules(locale);
        pluralRulesCache.set(locale, rules);
      }
      return rules.select(count);
    } catch {
      // Invalid locale tag
      return count <= 1 ? 'one' : 'other';
    }
  }

  private static interpolateVariables(text: string, diff: DateInterval, locale: string): string {
    const regexp = /%([a-z]+)/gi;
    return text.replace(regexp, (match, symbol) => {
      const value = RuleTemplateParser.getValueFromSymbol(symbol, diff, locale);
      return value !== null ? value : match;
    });
  }

  private static getValueFromSymbol(symbol: string, diff: DateInterval, locale: string): string | null {
    switch (symbol) {
      case 'dd': return diff.day.toString();
      case 'dh': return diff.hour.toString();
      case 'dm': return diff.minute.toString();
      case 'ds': return diff.second.toString();
      default: {
        const result = DateFormatter.format(`%${symbol}`, diff.date, locale);
        return result !== `%${symbol}` ? result : null;
      }
    }
  }
}
