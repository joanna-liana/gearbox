export class Threshold {
  private static readonly MAX = 100;
  private static readonly MIN = 0;

  constructor(private readonly _threshold: number) {}

  static of(threshold: number) {
    if (threshold > this.MAX || threshold < this.MIN) {
      throw new Error(`Illegal threshold: ${threshold}`);
    }

    return new Threshold(threshold);
  }

  get value() {
    return this._threshold;
  }
}
