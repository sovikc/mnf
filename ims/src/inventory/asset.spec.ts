import { buildMakeAsset } from './asset';
import { UUID } from './uuid';

const mockUUID: UUID = (function Impl(): UUID {
  return {
    make: function mockMake(): string {
      return 'ckf4y8lxz0001rw0fdf6b0rur';
    },
    isValid: function mockMake(id: string): boolean {
      return id != null;
    },
  };
})();

const Asset: string = 'asset';
describe(Asset, function some() {
  it('must be able to create the factory', () => {
    const makeAsset = buildMakeAsset(mockUUID);
    expect(makeAsset).toBeDefined();
  });
  it('must return an error if name is empty', () => {
    const makeAsset = buildMakeAsset(mockUUID);
    const asset = makeAsset('', 12.2, 10.2, 1, true);
    expect(asset).toBeInstanceOf(Error);
    /* expect(() => makeAsset('', 12.2, 10.2, 1, true)).toThrow(
      'Asset name should have a minimum length of 1 and maximum length of 255.',
    ); */
  });
  it('must return an error if name is undefined', () => {
    const makeAsset = buildMakeAsset(mockUUID);
    const asset = makeAsset(undefined, 12.2, 10.2, 1, true);
    expect(asset).toBeInstanceOf(Error);
  });
  it('must return an error if dimensions are undefined', () => {
    const makeAsset = buildMakeAsset(mockUUID);
    const asset = makeAsset('sample', undefined, undefined, undefined, true);
    expect(asset).toBeInstanceOf(Error);
  });
  it('must return an error if dimensions are less than 1', () => {
    const makeAsset = buildMakeAsset(mockUUID);
    const asset = makeAsset('sample', 12.2, -10.2, 0, true);
    expect(asset).toBeInstanceOf(Error);
  });
});
