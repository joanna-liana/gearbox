export enum AggressiveModeType {
  One = 1,
  Two = 2,
  Three = 3,
}

export class AggressiveMode {
  private readonly aggressiveModeFactorMap: {
    [key in AggressiveModeType]: number;
  } = {
    [AggressiveModeType.One]: 1.0,
    [AggressiveModeType.Two]: 1.2,
    [AggressiveModeType.Three]: 1.3,
  };

  constructor(private readonly _type: AggressiveModeType) {}

  static ofType(type: AggressiveModeType) {
    if (!(type in AggressiveModeType)) {
      throw new Error(`Illegal aggressive mode type: ${type}`);
    }

    return new AggressiveMode(type);
  }

  get factor(): number {
    return this.aggressiveModeFactorMap[this._type];
  }
}
