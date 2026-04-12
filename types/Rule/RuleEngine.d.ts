import DateInterval from '../DateInterval/DateInterval';
import Rule from './Rule';
import RuleRender from './RuleRender';
export default class RuleEngine {
    render(rules: Rule[], itemDateInterval: DateInterval, locale: string): RuleRender | null;
    private calculateNextUpdate;
}
