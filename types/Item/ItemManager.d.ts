import Item from './Item';
import Rule from '../Rule/Rule';
import RuleEngine from '../Rule/RuleEngine';
export default class ItemManager {
    private readonly ruleEngine;
    private readonly locale;
    private items;
    constructor(ruleEngine: RuleEngine, locale: string);
    addItems(newItems: Item[]): void;
    analyse(rules: Rule[]): void;
    private manageItem;
    private setHtml;
    private removeItem;
}
