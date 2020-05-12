import { ClientGearboxWrapper } from './wrappers/ClientGearboxWrapper';
import { Gearbox } from '../externals/Gearbox';
import { ClientExternalSystemsWrapper } from './wrappers/ClientExternalSystemsWrapper';
import { ExternalSystems } from '../externals/ExternalSystems';
import { GearboxDriver } from './GearboxDriver';
import { getTestGearboxModeDrivers } from '../testUtils/testGearboxModeDrivers';
import { DriveMode, DriveModeType } from './domain/DriveMode';
import { Threshold } from './domain/Threshold';

const runDemo = () => {
  const gearbox = new ClientGearboxWrapper(new Gearbox());
  const externals = new ClientExternalSystemsWrapper(new ExternalSystems());
  const modeDrivers = getTestGearboxModeDrivers(gearbox);

  const driver = new GearboxDriver(externals, gearbox, modeDrivers);

  console.log('Created driver integrated with client API\n');

  console.log('Changing drive mode to Sport...\n');
  driver.driveMode = DriveMode.ofType(DriveModeType.Sport);

  console.log('Now put the pedal to the metal\n');
  driver.handleGas(Threshold.of(0.9));
};

runDemo();
