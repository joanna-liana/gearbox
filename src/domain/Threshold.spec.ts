import { Threshold } from './Threshold';

describe('Threshold', () => {
  it.each([1, 2, 3, 10])('creates a valid threshold - %s', (threshold) => {
    const newThreshold = Threshold.of(threshold);

    expect(newThreshold).toBeInstanceOf(Threshold);
  });

  it.each([-1, 101])(
    'throws when trying to create an invalid Threshold - %s',
    (invalidThreshold) => {
      expect(() => Threshold.of(invalidThreshold)).toThrowError(
        `Illegal threshold: ${invalidThreshold}`
      );
    }
  );
});
