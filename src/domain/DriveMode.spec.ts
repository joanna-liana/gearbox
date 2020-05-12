import { DriveModeType, DriveMode } from './DriveMode';

describe('DriveMode', () => {
  it.each(Object.keys(DriveModeType))(
    'creates a valid DriveMode - %s',
    (type) => {
      const driveMode = DriveMode.ofType(type as DriveModeType);

      expect(driveMode).toBeInstanceOf(DriveMode);
    }
  );

  it('throws when trying to create an invalid DriveMode', () => {
    const invalidType = 'TestMode';

    expect(() => DriveMode.ofType(invalidType as any)).toThrowError(
      `Invalid drive mode type: ${invalidType}`
    );
  });

  it.each(Object.keys(DriveModeType))('gets DriveMode type - %s', (type) => {
    const driveMode = DriveMode.ofType(type as DriveModeType);

    expect(driveMode.type).toBe(type);
  });
});
