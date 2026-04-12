import Item from './Item';
export default class ItemObserver {
    private observer;
    start(selector: string, onNewItems: (items: Item[]) => void): void;
    stop(): void;
    private handleMutations;
}
