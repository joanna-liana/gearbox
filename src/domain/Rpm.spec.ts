import { Rpm } from './Rpm';

describe('Rpm', () => {
  it.each([1, 2, 3, 10])('creates a valid rpm - %s', (rpm) => {
    const newRpm = Rpm.of(rpm);

    expect(newRpm).toBeInstanceOf(Rpm);
  });

  it.each([-1, -10])(
    'throws when trying to create an invalid Rpm - %s',
    (invalidRpm) => {
      expect(() => Rpm.of(invalidRpm)).toThrowError(
        `Illegal rpm: ${invalidRpm}`
      );
    }
  );

  it.each([1000, 2000, 3000])('gets Rpm value - %s', (value) => {
    const rpm = Rpm.of(value).value;

    expect(rpm).toEqual(value);
  });
});
