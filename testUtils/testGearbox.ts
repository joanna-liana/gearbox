import { Gearbox } from '../externals/Gearbox';
import { IGearbox, GearboxState } from '../src/wrappers/Gearbox';
import { ClientGearboxWrapper } from '../src/wrappers/ClientGearboxWrapper';

export interface TestGearboxParams {
  state?: GearboxState;
  currentGear?: number;
  maxDrive?: number;
}

export const getTestGearbox = (params: TestGearboxParams = {}): Gearbox => {
  const instance = new Gearbox();

  const defaultParams: TestGearboxParams = {
    currentGear: 1,
    maxDrive: 5,
    state: GearboxState.Drive,
  };

  const { currentGear, state, maxDrive } = { ...defaultParams, ...params };
  instance.setGearBoxCurrentParams([state, currentGear]);
  instance.setMaxDrive(maxDrive);

  return instance;
};

export const getTestWrappedClientGearbox = (
  params?: TestGearboxParams
): IGearbox => {
  return new ClientGearboxWrapper(getTestGearbox(params));
};
