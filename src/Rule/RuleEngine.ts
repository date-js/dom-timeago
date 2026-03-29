import DateInterval from '../DateInterval/DateInterval';
import Rule from './Rule';
import RuleRender from './RuleRender';
import RuleMatcher from './RuleMatcher';
import RuleTemplateParser from './RuleTemplateParser';

export default class RuleEngine {
  public render(rules: Rule[], itemDateInterval: DateInterval, locale: string): RuleRender | null {
    const ruleFound = RuleMatcher.find(rules, itemDateInterval, locale);

    if (!ruleFound) {
      return null;
    }

    return new RuleRender(
      RuleTemplateParser.parse(ruleFound.text[locale], itemDateInterval, locale),
      this.calculateNextUpdate(ruleFound)
    );
  }

  private calculateNextUpdate(rule: Rule, now: number = Date.now()): Date | null | undefined {
    if (rule.refresh === null) {
      return null;
    }

    if (rule.refresh === undefined) {
      return undefined;
    }

    return new Date(now + rule.refresh * 1000);
  }
}
