export class Progress {
    private progress: any; // Assuming $Progress is an object with appropriate methods

    constructor(progressInstance: any) {
        this.progress = progressInstance;
    }

    start() {
        this.progress.start();
    }

    finish() {
        this.progress.finish();
    }

    increase(amount: number) {
        this.progress.increase(amount);
    }

    decrease(amount: number) {
        this.progress.decrease(amount);
    }

    get isLoading(): boolean {
        return computed(() => this.progress.get() !== 100).value;
    }
}