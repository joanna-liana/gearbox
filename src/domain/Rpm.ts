export class Rpm {
  private static readonly MIN = 0;

  constructor(private readonly _value: number) {}

  static of(value: number) {
    if (value < this.MIN) {
      throw new Error(`Illegal rpm: ${value}`);
    }

    return new Rpm(value);
  }

  get value() {
    return this._value;
  }
}
