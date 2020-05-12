import { Gear } from './Gear';

describe('Gear', () => {
  it.each([1, 2, 3, 10])('creates a valid Gear - %s', (gear) => {
    const newGear = Gear.of(gear);

    expect(newGear).toBeInstanceOf(Gear);
  });

  it.each([0, -1])(
    'throws when trying to create an invalid Gear - %s',
    (invalidGear) => {
      expect(() => Gear.of(invalidGear)).toThrowError(
        `Illegal gear: ${invalidGear}`
      );
    }
  );
});
