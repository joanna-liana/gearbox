import sinon from 'sinon';

import { GearboxDriver, GearboxModeDrivers } from './GearboxDriver';
import { getTestWrappedClientGearbox, TestGearboxParams } from '../testUtils/testGearbox';
import { getTestWrappedExternalSystems, TestExternalSystemsParams } from '../testUtils/testExternalSystems';
import { getTestGearboxModeDrivers } from '../testUtils/testGearboxModeDrivers';
import { Gear } from './domain/Gear';
import { IGearbox, GearboxState } from './wrappers/Gearbox';
import { IExternalSystems } from './wrappers/IExternalSystems';
import { DriveModeType, DriveMode } from './domain/DriveMode';
import { Threshold } from './domain/Threshold';

describe('GearboxDriver', () => {
  let driver: GearboxDriver;
  let gearbox: IGearbox;
  let externalSystems: IExternalSystems;
  let modeDrivers: GearboxModeDrivers;

  const createDriver = (
    gearboxParams?: TestGearboxParams,
    externalsParams?: TestExternalSystemsParams
  ) => {
    gearbox = getTestWrappedClientGearbox(gearboxParams);
    externalSystems = getTestWrappedExternalSystems(externalsParams);
    modeDrivers = getTestGearboxModeDrivers(gearbox);

    driver = new GearboxDriver(
      externalSystems,
      gearbox,
      modeDrivers,
    );
  };

  beforeEach(() => {
    sinon.restore();
  });

  describe('changes gear manually', () => {
    it('changes gear when provided a valid gear', () => {
      createDriver();
      const changeGearSpy = sinon.spy(gearbox, 'setCurrentGear');
      const gear = Gear.of(5);

      driver.changeGearManually(gear);

      sinon.assert.calledWithExactly(changeGearSpy, gear);
    });

    it('throws when an invalid gear is provided', () => {
      createDriver();

      const changeGearSpy = sinon.spy(gearbox, 'setCurrentGear');

      expect(() => driver.changeGearManually('gear' as any)).toThrow();
      sinon.assert.notCalled(changeGearSpy);
    });
  });

  describe('sets drive mode', () => {
    it.each(Object.keys(DriveModeType))(
      'sets a valid drive mode type - %s',
      (driveModeType) => {
        createDriver();

        const driveMode = DriveMode.ofType(driveModeType as DriveModeType);

        driver.driveMode = driveMode;

        expect(driver.driveMode).toBe(driveMode);
      }
    );

    it('throws when an invalid drive mode is provided', () => {
      createDriver();

      expect(() => (driver.driveMode = 'test' as any)).toThrow();
    });
  });

  describe('handlesGas', () => {
    it.each([GearboxState.Neutral, GearboxState.Park, GearboxState.Reverse])(
      'does not handle gas if the currect gearbox state is other than Drive',
      (state) => {
        createDriver({ state });
        driver.driveMode = DriveMode.ofType(DriveModeType.Comfort);
        const gasHandleSpy = sinon.spy(modeDrivers.comfortGearboxDriver, 'handleGas');

        driver.handleGas(Threshold.of(0));

        sinon.assert.notCalled(gasHandleSpy);
      }
    );

    it('does not handle gas when passed an invalid Threshold', () => {
      createDriver({ state: GearboxState.Drive, });
      driver.driveMode = DriveMode.ofType(DriveModeType.Comfort);
      const gasHandleSpy = sinon.spy(modeDrivers.comfortGearboxDriver, 'handleGas');

      expect(() => driver.handleGas(null)).toThrow();

      sinon.assert.notCalled(gasHandleSpy);
    });

    it('handles gas by drive mode (Comfort)', () => {
      createDriver({ state: GearboxState.Drive });
      driver.driveMode = DriveMode.ofType(DriveModeType.Comfort);
      const gasHandleSpy = sinon.spy(modeDrivers.comfortGearboxDriver, 'handleGas');

      driver.handleGas(Threshold.of(0));

      sinon.assert.calledOnce(gasHandleSpy);
    });

    it('handles gas by drive mode (Eco)', () => {
      createDriver({ state: GearboxState.Drive });
      driver.driveMode = DriveMode.ofType(DriveModeType.Eco);
      const gasHandleSpy = sinon.spy(modeDrivers.ecoGearboxDriver, 'handleGas');

      driver.handleGas(Threshold.of(0));

      sinon.assert.calledOnce(gasHandleSpy);
    });

    it('handles gas by drive mode (Sport)', () => {
      createDriver({ state: GearboxState.Drive });
      driver.driveMode = DriveMode.ofType(DriveModeType.Sport);
      const gasHandleSpy = sinon.spy(modeDrivers.sportGearboxDriver, 'handleGas');

      driver.handleGas(Threshold.of(0));

      sinon.assert.calledOnce(gasHandleSpy);
    });
  });
});
