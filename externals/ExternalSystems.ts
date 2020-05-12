import { Lights } from './Lights';

export class ExternalSystems {
  private currentRpm: number;
  private angularSpeed = 150;
  private lights = new Lights();

  ExternalSystems() {}

  public getCurrentRpm(): number {
    //sciagnij RPM z dostepnego miejsca
    return this.currentRpm;
  }

  public setCurrentRpm(currentRpm: number): void {
    this.currentRpm = currentRpm;
  }

  public getAngularSpeed(): number {
    return this.angularSpeed;
  }

  public setAngularSpeed(angularSpeed: number): void {
    this.angularSpeed = angularSpeed;
  }

  public getLights(): Lights {
    return this.lights;
  }
}
