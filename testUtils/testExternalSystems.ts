import { ExternalSystems } from '../externals/ExternalSystems';
import { ClientExternalSystemsWrapper } from '../src/wrappers/ClientExternalSystemsWrapper';

export interface TestExternalSystemsParams {
  currentRpm?: number;
}

export const getTestWrappedExternalSystems = (params: TestExternalSystemsParams = {}): ClientExternalSystemsWrapper => {
  const externalSystems = new ExternalSystems();

  const defaultParams: TestExternalSystemsParams = {
    currentRpm: 2000,
  };

  const { currentRpm } = { ...defaultParams, ...params };

  currentRpm && externalSystems.setCurrentRpm(currentRpm);

  return new ClientExternalSystemsWrapper(externalSystems);
};
