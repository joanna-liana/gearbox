import sinon from 'sinon';

import { getTestWrappedClientGearbox } from '../testUtils/testGearbox';
import { SportModeGearboxDriver } from './SportModeGearboxDriver';
import { Rpm } from './domain/Rpm';
import { Threshold } from './domain/Threshold';
import { AggressiveMode, AggressiveModeType } from './domain/AggressiveMode';

describe('SportModeGearboxDriver', () => {
  const gearbox = getTestWrappedClientGearbox();
  const driver = new SportModeGearboxDriver(gearbox);

  beforeEach(() => {
    sinon.restore();
  });

  describe('changes gears', () => {
    describe('switches gear down', () => {
      it.each([1499, 1000])(
        'switches gear down if current rpm is below characteristics (1500)',
        (currentRpm) => {
          const spy = sinon.spy(gearbox, 'switchGearDown');

          driver.handleGas(
            Threshold.of(0),
            Rpm.of(currentRpm),
            AggressiveMode.ofType(AggressiveModeType.One)
          );

          sinon.assert.calledOnce(spy);
        }
      );

      it.each([1500, 5000, 3000])(
        'does not switch gear if current rpm is equal to or above lower characteristics value (1500) and below or equal to upper value (5000)',
        (currentRpm) => {
          const switchDownSpy = sinon.spy(gearbox, 'switchGearDown');
          const switchUpSpy = sinon.spy(gearbox, 'switchGearUp');

          driver.handleGas(
            Threshold.of(0),
            Rpm.of(currentRpm),
            AggressiveMode.ofType(AggressiveModeType.One)
          );

          sinon.assert.notCalled(switchDownSpy);
          sinon.assert.notCalled(switchUpSpy);
        }
      );
    });

    describe('switches gear up based on aggressive mode', () => {
      it.each([AggressiveModeType.One, AggressiveModeType.Two, AggressiveModeType.Three])(
        'switches gear up if current rpm is above characteristics (5000) multiplied by AggressiveMode factor - mode %s',
        (aggressiveModeType) => {
          const switchUpSpy = sinon.spy(gearbox, 'switchGearUp');

          const aggressiveMode = AggressiveMode.ofType(aggressiveModeType as AggressiveModeType);
          const rpmToSwitchGear = (aggressiveMode.factor * 5000) + 1;

          driver.handleGas(
            Threshold.of(0),
            Rpm.of(rpmToSwitchGear),
            aggressiveMode
          );

          sinon.assert.calledOnce(switchUpSpy);
        }
      );
    });

    describe('triggers kickdown', () => {
      it.each([0.6, 0.7])(
        'triggers light kickdown if the threshold is in the right range (> 0.5 && <= 0.7)',
        (threshold) => {
          const spy = sinon.spy(gearbox, 'switchGearDown');

          driver.handleGas(
            Threshold.of(threshold),
            Rpm.of(2000),
            AggressiveMode.ofType(AggressiveModeType.One)
          );

          sinon.assert.calledOnce(spy);
        }
      );

      it.each([0.8, 0.9, 1.0])(
        'triggers double kickdown if the threshold is in the right range (> =0.7)',
        (threshold) => {
          const gearDownSpy = sinon.spy(gearbox, 'switchGearDown');

          driver.handleGas(
            Threshold.of(threshold),
            Rpm.of(2000),
            AggressiveMode.ofType(AggressiveModeType.One)
          );

          sinon.assert.calledTwice(gearDownSpy);
        }
      );
    });
  });
});
