import Item from './Item';
import ItemExtractor from './ItemExtractor';

export default class ItemObserver {
  private observer: MutationObserver | null = null;

  public start(selector: string, onNewItems: (items: Item[]) => void): void {
    this.observer = new MutationObserver(mutations => this.handleMutations(mutations, selector, onNewItems));
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  public stop(): void {
    this.observer?.disconnect();
  }

  private handleMutations(
    mutations: MutationRecord[],
    selector: string,
    onNewItems: (items: Item[]) => void
  ): void {
    const newItems: Item[] = [];

    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node instanceof Element) {
          newItems.push(...ItemExtractor.extract(selector, node));
        }
      });
    }

    if (newItems.length > 0) {
      onNewItems(newItems);
    }
  }
}
