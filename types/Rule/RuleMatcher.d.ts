import DateInterval from '../DateInterval/DateInterval';
import Rule from './Rule';
export default class RuleMatcher {
    static find(rules: Rule[], dateInterval: DateInterval, locale: string): Rule | null;
}
