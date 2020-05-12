import sinon from 'sinon';

import { ClientExternalSystemsWrapper } from './ClientExternalSystemsWrapper';
import { ExternalSystems } from '../../externals/ExternalSystems';

describe('ClientExternalSystemsWrapper', () => {
  it.each([2000, 3000, 4500])('gets current rpm - %s', (rpm) => {
    const externals = new ExternalSystems();
    externals.setCurrentRpm(rpm);
    const wrapper = new ClientExternalSystemsWrapper(externals);

    const currentRpm = wrapper.getCurrentRpm();

    expect(currentRpm.value).toEqual(rpm);
  });

  it.each([2000, 3000, 4500])('gets angular speed - %s', (speed) => {
    const externals = new ExternalSystems();
    externals.setAngularSpeed(speed);
    const wrapper = new ClientExternalSystemsWrapper(externals);

    const angularSpeed = wrapper.getAngularSpeed();

    expect(angularSpeed).toEqual(speed);
  });

  it('gets lights position', () => {
    const testLightsPosition = 1;
    const externals = new ExternalSystems();
    externals.getLights().position = testLightsPosition;
    const wrapper = new ClientExternalSystemsWrapper(externals);

    const lightsPosition = wrapper.getLightsPosition();

    expect(lightsPosition).toEqual(testLightsPosition);
  });

  it('throws when trying to get lights position when lights are unavailable', () => {
    const testLightsPosition = 1;
    const externals = new ExternalSystems();
    sinon.stub(externals, 'getLights').returns(null);
    const wrapper = new ClientExternalSystemsWrapper(externals);

    expect(wrapper.getLightsPosition.bind(wrapper)).toThrowError(
      'Lights do not exist'
    );
  });
});
