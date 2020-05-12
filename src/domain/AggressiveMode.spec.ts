import { AggressiveMode, AggressiveModeType } from './AggressiveMode';

describe('AggressiveMode', () => {
  it.each([1, 2, 3])('creates a valid AggressiveMode - %s', (type) => {
    const aggressiveMode = AggressiveMode.ofType(type);

    expect(aggressiveMode).toBeInstanceOf(AggressiveMode);
  });

  it.each([0, 4])(
    'throws when trying to create an invalid AggressiveMode - %s',
    (invalidType) => {
      expect(() => AggressiveMode.ofType(invalidType)).toThrowError(
        `Illegal aggressive mode type: ${invalidType}`
      );
    }
  );

  it.each([
    [AggressiveModeType.One, 1],
    [AggressiveModeType.Two, 1.2],
    [AggressiveModeType.Three, 1.3],
  ])('gets AggressiveMode factor - %s', (type, factor) => {
    const aggressiveModeFactor = AggressiveMode.ofType(type).factor;

    expect(aggressiveModeFactor).toBe(factor);
  });
});
