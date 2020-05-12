export class Gear {
  private static readonly MIN = 1;
  constructor(private readonly _gear: number) {}

  static of(gear: number) {
    if (gear < this.MIN) {
      throw new Error(`Illegal gear: ${gear}`);
    }

    return new Gear(gear);
  }

  get value() {
    return this._gear;
  }
}
