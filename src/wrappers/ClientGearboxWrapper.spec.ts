import { GearboxState } from './Gearbox';
import { ClientGearboxWrapper } from './ClientGearboxWrapper';
import { Gear } from '../domain/Gear';
import { getTestGearbox } from '../../testUtils/testGearbox';

describe('ClientGearboxWrapper', () => {
  it.each([
    [1, GearboxState.Drive],
    [2, GearboxState.Park],
    [3, GearboxState.Reverse],
    [4, GearboxState.Neutral],
  ])(
    'gets gearbox state (%s), correctly mapped into a human-readable name (%s)',
    (gearboxState, mappedState) => {
      const gearbox = getTestGearbox({ state: gearboxState });
      const wrapper = new ClientGearboxWrapper(gearbox);

      const state = wrapper.getState();

      expect(state).toEqual(mappedState);
    }
  );

  it('throws if the gearbox state cannot be mapped into a human-readable name', () => {
    const invalidState = 'invalid state';
    const gearbox = getTestGearbox({ state: invalidState as any });
    const wrapper = new ClientGearboxWrapper(gearbox);

    expect(wrapper.getState.bind(wrapper)).toThrowError(
      `Unsupported state: ${invalidState}`
    );
  });

  it.each([1, 2, 3, 4])('gets current gear (%s)', (currentGear) => {
    const gearbox = getTestGearbox({ currentGear });
    const wrapper = new ClientGearboxWrapper(gearbox);

    const gear = wrapper.getCurrentGear();

    expect(gear.value).toEqual(currentGear);
  });

  describe('sets current gear', () => {
    it.each([1, 2, 3, 4])(
      'sets specific current gear (%s)',
      (currentGear) => {
        const gearbox = getTestGearbox();
        const wrapper = new ClientGearboxWrapper(gearbox);
        const spy = jest.spyOn(gearbox, 'setCurrentGear');

        wrapper.setCurrentGear(new Gear(currentGear));

        expect(spy).toHaveBeenCalledWith(currentGear);
      }
    );

    it('does not change gear if the current gear is equal to max gear', () => {
      const maxGear = 5;
      const gearbox = getTestGearbox({ maxDrive: maxGear });
      const wrapper = new ClientGearboxWrapper(gearbox);
      const spy = jest.spyOn(gearbox, 'setCurrentGear');

      wrapper.setCurrentGear(new Gear(maxGear));

      expect(spy).not.toHaveBeenCalled();
    });

    it('throws when setting invalid current gear (%s)', () => {
      const gearbox = getTestGearbox();
      const wrapper = new ClientGearboxWrapper(gearbox);
      const spy = jest.spyOn(gearbox, 'setCurrentGear');
      const invalidGear = 0;

      expect(() => wrapper.setCurrentGear(Gear.of(invalidGear))).toThrowError(
        `Illegal gear: ${invalidGear}`
      );
      expect(spy).not.toHaveBeenCalled();
    });

    it('switches gear up', () => {
      const currentGear = 1;
      const gearbox = getTestGearbox({ currentGear });
      const wrapper = new ClientGearboxWrapper(gearbox);

      wrapper.switchGearUp();

      expect(gearbox.getCurrentGear()).toEqual(currentGear + 1);
    });

    it('switches gear down', () => {
      const currentGear = 2;
      const gearbox = getTestGearbox({ currentGear });
      const wrapper = new ClientGearboxWrapper(gearbox);

      wrapper.switchGearDown();

      expect(gearbox.getCurrentGear()).toEqual(currentGear - 1);
    });
  });

  it.each([1, 2, 3, 4])('gets max gear (%s)', (maxGear) => {
    const gearbox = getTestGearbox({ maxDrive: maxGear });
    const wrapper = new ClientGearboxWrapper(gearbox);

    const gearboxMaxGear = wrapper.getMaxGear();

    expect(gearboxMaxGear.value).toEqual(maxGear);
  });

  it('setGearBoxCurrentParams calls the corresponding gearbox method correctly', () => {
    const gearbox = getTestGearbox();
    const wrapper = new ClientGearboxWrapper(gearbox);
    const spy = jest.spyOn(gearbox, 'setGearBoxCurrentParams');
    const newParams = {
      state: GearboxState.Drive,
      currentGear: new Gear(1),
    };

    wrapper.setGearBoxCurrentParams(newParams);

    expect(spy).toHaveBeenCalledWith([
      newParams.state,
      newParams.currentGear.value,
    ]);
  });
});
