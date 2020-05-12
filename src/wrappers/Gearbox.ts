import { Gear } from '../domain/Gear';

export enum GearboxState {
  Drive = 1,
  Park = 2,
  Reverse = 3,
  Neutral = 4,
}

export interface IGearboxParams {
  state: GearboxState;
  currentGear: Gear;
}

export interface IGearbox {
  getState(): GearboxState;
  getCurrentGear(): Gear;
  switchGearUp(): void;
  switchGearDown(): void;
  setCurrentGear(currentGear: Gear): void;
  setGearBoxCurrentParams(params: IGearboxParams): void;
  getMaxGear(): Gear;
  isDriveState(): boolean;
}
