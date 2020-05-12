import { Rpm } from 'src/domain/Rpm';

export interface IExternalSystems {
  getCurrentRpm(): Rpm;

  getAngularSpeed(): number;

  getLightsPosition(): unknown;
}
