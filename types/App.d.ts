import Configuration from './Configuration/Configuration';
export default class App {
    private rules;
    private timer;
    private readonly observer;
    private readonly itemManager;
    constructor();
    start(userConfig?: Configuration | null): void;
    stop(): void;
    private startTimer;
}
