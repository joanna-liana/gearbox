import { IGearbox } from './wrappers/Gearbox';
import { Threshold } from './domain/Threshold';
import { ModeGearboxDriver } from './domain/ModeGearboxDriver';
import { AggressiveMode } from './domain/AggressiveMode';
import { Rpm } from './domain/Rpm';

enum EcoCharacteristics {
  AccelerationRpmGearUp = 2000,
  AccelerationRpmGearDown = 2000,
  BrakeRpmGearDown = 1500,
}

export class EcoModeGearboxDriver extends ModeGearboxDriver {
  private characteristics = EcoCharacteristics;

  constructor(private readonly gearbox: IGearbox) {
    super();
  }

  private shouldSwitchGearUp(currentRpm: Rpm) {
    return currentRpm.value > this.characteristics.AccelerationRpmGearUp;
  }

  private shouldSwitchGearDown(currentRpm: Rpm) {
    return currentRpm.value < this.characteristics.AccelerationRpmGearDown;
  }

  public handleGas(_threshold: Threshold, currentRpm: Rpm, _aggressiveMode: AggressiveMode) {
    if (this.shouldSwitchGearDown(currentRpm)) {
      return this.gearbox.switchGearDown();
    }

    if (this.shouldSwitchGearUp(currentRpm)) {
      return this.gearbox.switchGearUp();
    }
  }
}
