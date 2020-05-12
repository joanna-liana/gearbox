import sinon from 'sinon';

import { getTestWrappedClientGearbox } from '../testUtils/testGearbox';
import { Rpm } from './domain/Rpm';
import { ComfortModeGearboxDriver } from './ComfortModeGearboxDriver';
import { Threshold } from './domain/Threshold';
import { AggressiveMode, AggressiveModeType } from './domain/AggressiveMode';

describe('ComfortModeGearboxDriver', () => {
  const gearbox = getTestWrappedClientGearbox();
  const driver = new ComfortModeGearboxDriver(gearbox);

  beforeEach(() => {
    sinon.restore();
  });

  describe('changes gears', () => {
    it.each([999, 500])(
      'switches gear down if current rpm is below characteristics (1000)',
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

    it.each([1000, 2500, 1500])(
      'does not switch gear if current rpm is equal to or above lower characteristics value (1000) and below or equal to upper value (2500) - %s',
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

    it.each([0.6, 0.7, 0.8, 0.9, 1.0])(
      'triggers kickdown if the threshold is in the right range (> 0.5) - %s',
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
  });
});
