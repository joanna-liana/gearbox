import { Threshold } from './Threshold';
import { AggressiveMode } from './AggressiveMode';
import { Rpm } from './Rpm';

export abstract class ModeGearboxDriver {
  public abstract handleGas(
    _threshold: Threshold,
    currentRpm: Rpm,
    aggressiveMode: AggressiveMode
  ): void;
}
