export enum DriveModeType {
  Eco = 'Eco',
  Comfort = 'Comfort',
  Sport = 'Sport',
}

export class DriveMode {
  constructor(private readonly _type: DriveModeType) {}

  static ofType(type: DriveModeType) {
    if (!(type in DriveModeType)) {
      throw new Error(`Invalid drive mode type: ${type}`);
    }

    return new DriveMode(type);
  }

  get type() {
    return this._type;
  }
}
