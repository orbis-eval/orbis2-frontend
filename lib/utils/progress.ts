export class Progress {
  private progress: any; // Assuming $Progress is an object with appropriate methods
  private debounceTimer: any;

  constructor(progressInstance: any) {
    this.progress = progressInstance;
    this.debounceTimer = null;
  }

  start() {
    if (this.progressValue === 0 || this.progressValue === 100) {
      this.progress.start();
    } else {
      this.progress.decrease(10);
    }
  }

  debounceFinish() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.progress.finish();
    }, 100);
  }

  finish() {
    this.debounceFinish();
  }

  increase(amount: number) {
    this.progress.increase(amount);
  }

  decrease(amount: number) {
    this.progress.decrease(amount);
  }

  set progressValue(value: number) {
    this.progress.set(value);
  }

  get progressValue(): number {
    return computed(() => this.progress.get()).value;
  }

  get isLoading(): boolean {
    return computed(() => this.progressValue !== 100 && this.progressValue > 0)
      .value;
  }
}
