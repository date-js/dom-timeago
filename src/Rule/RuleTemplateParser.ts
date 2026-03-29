import DateFormatter from '@date-js/date-formatter';
import DateInterval from '../DateInterval/DateInterval';

export default class RuleTemplateParser {
  public static parse(text: string, diff: DateInterval, locale: string): string {
    const withPlurals = RuleTemplateParser.resolvePlurals(text, diff, locale);
    const withVariables = RuleTemplateParser.interpolateVariables(withPlurals, diff, locale);
    return withVariables.replace('\\', '');
  }

  private static resolvePlurals(text: string, diff: DateInterval, locale: string): string {
    const regexp = /{%([a-z]+)\|([^|\[\]]*)\|([^|\[\]]*)}/gi;
    return text.replace(regexp, (_, symbol, singular, plural) => {
      const value = RuleTemplateParser.getValueFromSymbol(symbol, diff, locale);
      if (value === null) {
        return '';
      }
      return parseInt(value, 10) <= 1 ? singular : plural;
    });
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
