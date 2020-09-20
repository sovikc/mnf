import { buildMakeLocation, buildMakeShoppingCentre } from './centre';
import { UUID } from './uuid';

const mockUUID: UUID = (function Impl(): UUID {
  return {
    make: function mockMake(): string {
      return 'cdg5y8lxz0001rw0fdf6b0rur';
    },
    isValid: function mockMake(id: string): boolean {
      return id != null;
    },
  };
})();

const Centre: string = 'centre';
describe(Centre, function centreTests() {
  it('must be able to create the factory', () => {
    const makeCentre = buildMakeShoppingCentre(mockUUID);
    expect(makeCentre).toBeDefined();
  });
  it('must return an error if name is empty', () => {
    const makeCentre = buildMakeShoppingCentre(mockUUID);
    const address = {
      lineOne: '12/2 Magic Street',
      city: 'Hogwarts',
      state: 'Dumblekin',
      postCode: '13000',
      country: 'Malkina',
    };
    const centre = makeCentre('', address);
    expect(centre).toBeInstanceOf(Error);
  });
  it('must return an error if name is undefined', () => {
    const makeCentre = buildMakeShoppingCentre(mockUUID);
    const address = {
      lineOne: '12/2 Magic Street',
      city: 'Hogwarts',
      state: 'Dumblekin',
      postCode: '13000',
      country: 'Malkina',
    };
    const centre = makeCentre(undefined, address);
    expect(centre).toBeInstanceOf(Error);
  });
  it('must return an error if address is undefined', () => {
    const makeCentre = buildMakeShoppingCentre(mockUUID);
    const asset = makeCentre('Northwind', undefined);
    expect(asset).toBeInstanceOf(Error);
  });
});

const Location: string = 'location';
describe(Location, function locationTests() {
  it('must be able to create the factory', () => {
    const makeLocation = buildMakeLocation(mockUUID);
    expect(makeLocation).toBeDefined();
  });
  it('must return an error if location code is empty', () => {
    const makeLocation = buildMakeLocation(mockUUID);
    const location = makeLocation('');
    expect(location).toBeInstanceOf(Error);
  });
  it('must return an error if location code is missing', () => {
    const makeLocation = buildMakeLocation(mockUUID);
    const location = makeLocation(undefined);
    expect(location).toBeInstanceOf(Error);
  });
});
