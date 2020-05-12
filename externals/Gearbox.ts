export class Gearbox {
  private maxDrive: number;
  private gearBoxCurrentParams: Object[] = [null, null]; //state, currentGear

  //state 1-Drive, 2-Park, 3-Reverse, 4-Neutral

  public getState(): Object {
    return this.gearBoxCurrentParams[0];
  }

  public getCurrentGear(): Object {
    return this.gearBoxCurrentParams[1];
  }

  public setCurrentGear(currentGear: number): void {
    this.gearBoxCurrentParams[1] = currentGear;
  }

  public setGearBoxCurrentParams(gearBoxCurrentParams: Object[]): void {
    if (gearBoxCurrentParams[0] != this.gearBoxCurrentParams[0]) {
      //zmienil sie state
      this.gearBoxCurrentParams[0] = gearBoxCurrentParams[0];
      const state = gearBoxCurrentParams[0];
      if (state == 2) {
        this.setCurrentGear(0);
      }
      if (state == 3) {
        this.setCurrentGear(-1);
      }
      if (state == 4) {
        this.setCurrentGear(0);
      }
      this.setCurrentGear(gearBoxCurrentParams[1] as number);
    } else {
      this.setCurrentGear(gearBoxCurrentParams[1] as number);
    }
  }

  public getMaxDrive(): number {
    return this.maxDrive;
  }

  public setMaxDrive(maxDrive: number): void {
    this.maxDrive = maxDrive;
  }
}
