import DateInterval from '../DateInterval/DateInterval';
export default class RuleTemplateParser {
    static parse(text: string, diff: DateInterval, locale: string): string;
    private static resolvePlurals;
    private static interpolateVariables;
    private static getValueFromSymbol;
}
