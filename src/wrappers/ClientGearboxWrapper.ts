import { IGearbox, GearboxState, IGearboxParams } from './Gearbox';
import { Gearbox } from '../../externals/Gearbox';
import { Gear } from '../domain/Gear';

export class ClientGearboxWrapper implements IGearbox {
  private GearboxStateMap: { [key: number]: GearboxState } = {
    1: GearboxState.Drive,
    2: GearboxState.Park,
    3: GearboxState.Reverse,
    4: GearboxState.Neutral,
  };

  constructor(private gearbox: Gearbox) {}

  public getState(): GearboxState {
    const state = this.gearbox.getState() as number;
    const mappedState = this.GearboxStateMap[state];

    if (!mappedState) {
      throw new Error(`Unsupported state: ${state}`);
    }

    return mappedState;
  }

  public getCurrentGear() {
    const gearValue = this.gearbox.getCurrentGear();

    return new Gear(gearValue as number);
  }

  // TODO: maybe make this private
  public setCurrentGear(currentGear: Gear): void {
    if (currentGear.value >= this.getMaxGear().value) {
      return;
    }

    this.gearbox.setCurrentGear(currentGear.value);
  }

  public switchGearUp(): void {
    this.setCurrentGear(new Gear(this.getCurrentGear().value + 1));
  }

  public switchGearDown(): void {
    this.setCurrentGear(new Gear(this.getCurrentGear().value - 1));
  }

  public setGearBoxCurrentParams({ state, currentGear }: IGearboxParams): void {
    this.gearbox.setGearBoxCurrentParams([state, currentGear.value]);
  }

  public getMaxGear(): Gear {
    return new Gear(this.gearbox.getMaxDrive());
  }

  public isDriveState(): boolean {
    return this.gearbox.getState() === GearboxState.Drive;
  }
}
