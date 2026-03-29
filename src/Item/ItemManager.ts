import Item from './Item';
import Rule from '../Rule/Rule';
import RuleEngine from '../Rule/RuleEngine';
import DateIntervalCalculator from '../DateInterval/DateIntervalCalculator';

export default class ItemManager {
  private items: Item[] = [];

  public constructor(
    private readonly ruleEngine: RuleEngine,
    private readonly locale: string
  ) {
  }

  public addItems(newItems: Item[]): void {
    this.items.push(...newItems);
  }

  public analyse(rules: Rule[]): void {
    const currentDate = new Date();

    const itemsToAnalyse = this.items.filter(
      item => item.nextUpdate === undefined || (item.nextUpdate !== null && item.nextUpdate < currentDate)
    );

    itemsToAnalyse.forEach(item => this.manageItem(item, rules));
  }

  private manageItem(item: Item, rules: Rule[]): void {
    const dateInterval = DateIntervalCalculator.getDateInterval(item.date);
    const ruleResult = this.ruleEngine.render(rules, dateInterval, this.locale);

    if (ruleResult !== null) {
      if (ruleResult.nextUpdate === null) {
        this.removeItem(item);
      }

      item.nextUpdate = ruleResult.nextUpdate;
      this.setHtml(item, ruleResult.render);
    } else {
      this.setHtml(item, item.initialContent);
    }
  }

  private setHtml(item: Item, newContent: string): void {
    if (item.reference.innerHTML !== newContent) {
      item.reference.innerHTML = newContent;
    }
  }

  private removeItem(itemToRemove: Item): void {
    this.items = this.items.filter(item => item !== itemToRemove);
  }
}
