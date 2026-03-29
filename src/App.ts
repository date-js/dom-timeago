import Configuration from './Configuration/Configuration';
import Rule from './Rule/Rule';
import RuleEngine from './Rule/RuleEngine';
import defaultRules from './defaultRules';
import ConfigurationValidator from './Configuration/ConfigurationValidator';
import LocaleManager from './Locale/LocaleManager';
import ItemExtractor from './Item/ItemExtractor';
import ItemManager from './Item/ItemManager';

export default class App {
  private static readonly EVENT_REFRESH = 'clever-date.update';

  private rules: Rule[] = [];

  private timer: number | null = null;

  private readonly itemManager: ItemManager;

  public constructor() {
    this.itemManager = new ItemManager(new RuleEngine(), LocaleManager.getLocaleName());
  }

  public start(userConfig: Configuration|null = null): void {
    const config = { ...new Configuration(), ...userConfig };
    config.rules = config.rules.concat(defaultRules);

    const error = ConfigurationValidator.validate(config);
    if (error instanceof Error) {
      throw error;
    }

    this.rules = config.rules;

    const execProcess = (): void => {
      this.itemManager.addItems(ItemExtractor.extract(config.selector));
      this.itemManager.analyse(this.rules);
    };

    if (this.timer === null) {
      this.timer = this.startTimer(config.refresh, execProcess);
    }

    window.addEventListener(App.EVENT_REFRESH, () => execProcess());

    execProcess();
  }

  public stop(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  private startTimer(interval: number, callback: () => void): number {
    return window.setInterval(() => {
      callback();
    }, interval * 1000);
  }
}
