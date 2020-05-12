import sinon from 'sinon';

import { getTestWrappedClientGearbox } from '../testUtils/testGearbox';
import { Rpm } from './domain/Rpm';
import { EcoModeGearboxDriver } from './EcoModeGearboxDriver';

describe('EcoModeGearboxDriver', () => {
  const gearbox = getTestWrappedClientGearbox();
  const driver = new EcoModeGearboxDriver(gearbox);

  beforeEach(() => {
    sinon.restore();
  });

  describe('changes gears', () => {
    it.each([1999, 1000])(
      'switches gear down if current rpm is below characteristics (2000)',
      (currentRpm) => {
        const spy = sinon.spy(gearbox, 'switchGearDown');

        driver.handleGas(null, Rpm.of(currentRpm), null);

        sinon.assert.calledOnce(spy);
      }
    );

    it.each([2000])(
      'does not switch gear if current rpm is equal to or above lower characteristics value (2000) and below or equal to upper value (2000)',
      (currentRpm) => {
        const switchDownSpy = sinon.spy(gearbox, 'switchGearDown');
        const switchUpSpy = sinon.spy(gearbox, 'switchGearUp');

        driver.handleGas(null, Rpm.of(currentRpm), null);

        sinon.assert.notCalled(switchDownSpy);
        sinon.assert.notCalled(switchUpSpy);
      }
    );

    it.each([2001, 5000])(
      'switches gear up if current rpm is above characteristics (2000)',
      (currentRpm) => {
        const switchUpSpy = sinon.spy(gearbox, 'switchGearUp');

        driver.handleGas(null, Rpm.of(currentRpm), null);

        sinon.assert.calledOnce(switchUpSpy);
      }
    );
  });
});
