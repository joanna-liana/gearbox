import { IExternalSystems } from './IExternalSystems';
import { ExternalSystems } from '../../externals/ExternalSystems';
import { Rpm } from '../domain/Rpm';

export class ClientExternalSystemsWrapper implements IExternalSystems {
  constructor(private externalSystems: ExternalSystems) {}

  public getCurrentRpm(): Rpm {
    return Rpm.of(this.externalSystems.getCurrentRpm());
  }

  getAngularSpeed(): number {
    return this.externalSystems.getAngularSpeed();
  }

  getLightsPosition() {
    const lights = this.externalSystems.getLights();

    if (!lights) {
      throw new Error('Lights do not exist');
    }

    return lights.getLightsPosition();
  }
}
