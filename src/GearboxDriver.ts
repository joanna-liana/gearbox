import { IGearbox } from './wrappers/Gearbox';
import { Threshold } from './domain/Threshold';
import { IExternalSystems } from './wrappers/IExternalSystems';
import { Gear } from './domain/Gear';
import { AggressiveMode, AggressiveModeType } from './domain/AggressiveMode';
import { ModeGearboxDriver } from './domain/ModeGearboxDriver';
import { Rpm } from './domain/Rpm';
import { DriveMode, DriveModeType } from './domain/DriveMode';

export interface GearboxModeDrivers {
  sportGearboxDriver: ModeGearboxDriver;
  comfortGearboxDriver: ModeGearboxDriver;
  ecoGearboxDriver: ModeGearboxDriver;
}

interface HandleGasParams {
  currentRpm: Rpm;
  threshold: Threshold;
  aggressiveMode: AggressiveMode;
}

export class GearboxDriver {
  protected aggressiveMode = AggressiveMode.ofType(AggressiveModeType.One);
  private _driveMode = DriveMode.ofType(DriveModeType.Comfort);

  private modeToDriverMap: { [key in DriveModeType]: ModeGearboxDriver } = {
    [DriveModeType.Comfort]: this.modeDrivers.comfortGearboxDriver,
    [DriveModeType.Eco]: this.modeDrivers.ecoGearboxDriver,
    [DriveModeType.Sport]: this.modeDrivers.sportGearboxDriver,
  };

  constructor(
    private readonly externalSystems: IExternalSystems,
    private readonly gearbox: IGearbox,
    private readonly modeDrivers: GearboxModeDrivers
  ) {}

  private handleGasByCurrentMode({
    currentRpm,
    threshold,
    aggressiveMode,
  }: HandleGasParams) {
    const modeDriver = this.modeToDriverMap[this.driveMode.type];

    modeDriver.handleGas(threshold, currentRpm, aggressiveMode);
  }

  public handleGas(threshold: Threshold): void {
    if (!this.gearbox.isDriveState()) {
      return;
    }

    if (!(threshold instanceof Threshold)) {
      throw new Error('Threshold must be a Threshold instance');
    }

    const currentRpm = this.externalSystems.getCurrentRpm();

    this.handleGasByCurrentMode({
      threshold,
      aggressiveMode: this.aggressiveMode,
      currentRpm,
    });
  }

  public changeGearManually(gear: Gear) {
    if (!(gear instanceof Gear)) {
      throw new Error('Gear must be a Gear instance');
    }

    this.gearbox.setCurrentGear(gear);
  }

  public set driveMode(mode: DriveMode) {
    if (!(mode instanceof DriveMode)) {
      throw new Error('Mode must be a DriveMode instance');
    }

    this._driveMode = mode;
  }

  public get driveMode(): DriveMode {
    return this._driveMode;
  }
}
