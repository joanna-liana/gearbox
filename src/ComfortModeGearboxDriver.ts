import { IGearbox } from './wrappers/Gearbox';
import { Threshold } from './domain/Threshold';
import { ModeGearboxDriver } from './domain/ModeGearboxDriver';
import { AggressiveMode } from './domain/AggressiveMode';
import { Rpm } from './domain/Rpm';

enum ComfortCharacteristics {
  AccelerationRpmGearDown = 1000,
  KickdownThreshold = 0.5,
  AccelerationRpmGearUp = 2500,
  KickdownRpmGearDown = 4500,
  BrakeRpmGearDown = 2000,
}

export class ComfortModeGearboxDriver extends ModeGearboxDriver {
  private characteristics = ComfortCharacteristics;

  constructor(private readonly gearbox: IGearbox) {
    super();
  }

  private shouldTriggerKickdown(threshold: Threshold) {
    return threshold.value > this.characteristics.KickdownThreshold;
  }

  private handleKickdown() {
    this.gearbox.switchGearDown();
  }

  private shouldSwitchGearDown(currentRpm: Rpm) {
    return currentRpm.value < this.characteristics.AccelerationRpmGearDown;
  }

  private shouldSwitchGearUp(currentRpm: Rpm, aggressiveMode: AggressiveMode) {
    return currentRpm.value > (this.characteristics.AccelerationRpmGearUp * aggressiveMode.factor);
  }

  public handleGas(threshold: Threshold, currentRpm: Rpm, aggressiveMode: AggressiveMode) {
    if (this.shouldTriggerKickdown(threshold)) {
      return this.handleKickdown();
    }

    if (this.shouldSwitchGearDown(currentRpm)) {
      return this.gearbox.switchGearDown();
    }

    if (this.shouldSwitchGearUp(currentRpm, aggressiveMode)) {
      return this.gearbox.switchGearUp();
    }
  }
}
