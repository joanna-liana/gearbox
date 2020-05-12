import { IGearbox } from '../src/wrappers/Gearbox';
import { GearboxModeDrivers } from '../src/GearboxDriver';
import { ComfortModeGearboxDriver } from '../src/ComfortModeGearboxDriver';
import { EcoModeGearboxDriver } from '../src/EcoModeGearboxDriver';
import { SportModeGearboxDriver } from '../src/SportModeGearboxDriver';

export const getTestGearboxModeDrivers = (
  gearbox: IGearbox
): GearboxModeDrivers => {
  return {
    comfortGearboxDriver: new ComfortModeGearboxDriver(gearbox),
    ecoGearboxDriver: new EcoModeGearboxDriver(gearbox),
    sportGearboxDriver: new SportModeGearboxDriver(gearbox),
  };
};
