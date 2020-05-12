import { IGearbox } from './wrappers/Gearbox';
import { Threshold } from './domain/Threshold';
import { ModeGearboxDriver } from './domain/ModeGearboxDriver';
import { Rpm } from './domain/Rpm';
import { AggressiveMode } from './domain/AggressiveMode';

enum SportCharacteristics {
  AccelerationRpmGearDown = 1500,
  AccelerationRpmGearUp = 5000,
  KickdownThreshold = 0.5,
  DoubleKickdownThreshold = 0.7,
  KickdownRpmGearDown = 5000,
  KickdownRpmDoubleGearDown = 5000,
  BrakeRpmGearDown = 300,
}

export class SportModeGearboxDriver extends ModeGearboxDriver {
  private characteristics = SportCharacteristics;

  constructor(private readonly gearbox: IGearbox) {
    super();
  }

  private handleKickdown(threshold: Threshold) {
    if (
      threshold.value > this.characteristics.KickdownThreshold &&
      threshold.value <= this.characteristics.DoubleKickdownThreshold
    ) {
      return this.gearbox.switchGearDown();
    }

    if (threshold.value > this.characteristics.DoubleKickdownThreshold) {
      this.gearbox.switchGearDown();
      this.gearbox.switchGearDown();
      return;
    }
  }

  private shouldTriggerKickdown(threshold: Threshold) {
    return threshold.value > this.characteristics.KickdownThreshold;
  }

  private shouldSwitchGearDown(currentRpm: Rpm) {
    return currentRpm.value < this.characteristics.AccelerationRpmGearDown;
  }

  private shouldSwitchGearUp(currentRpm: Rpm, aggressiveMode: AggressiveMode) {
    return currentRpm.value > (this.characteristics.AccelerationRpmGearUp * aggressiveMode.factor);
  }

  public handleGas(threshold: Threshold, currentRpm: Rpm, aggressiveMode: AggressiveMode) {
    if (this.shouldTriggerKickdown(threshold)) {
      return this.handleKickdown(threshold);
    }

    if (this.shouldSwitchGearDown(currentRpm)) {
      return this.gearbox.switchGearDown();
    }

    if (this.shouldSwitchGearUp(currentRpm, aggressiveMode)) {
      return this.gearbox.switchGearUp();
    }
  }
}
