import DateInterval from '../DateInterval/DateInterval';
import Rule from './Rule';

export default class RuleMatcher {
  public static find(rules: Rule[], dateInterval: DateInterval, locale: string): Rule | null {
    return rules.find(rule => rule.condition(dateInterval) && locale in rule.text) ?? null;
  }
}
