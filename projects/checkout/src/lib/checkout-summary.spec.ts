import { CarColorDto, CarEngineDto, CarRimDto, SpecialEquipmentDto } from '@carconfig/api-client';
import { buildOrderLines, calculateTotalPrice } from './checkout-summary';

describe('checkout summary', () => {
  const engine = { productId: 'eng-1', model: 'E-Drive', price: 32000 } as CarEngineDto;
  const color = { productId: 'color-1', colorName: 'Ocean Blue', price: 0 } as CarColorDto;
  const rims = { productId: 'rim-1', rimName: 'Aero', price: 1200 } as CarRimDto;
  const equipment = [
    { productId: 'eq-1', equipmentName: 'Navigation', categoryType: SpecialEquipmentDto.CategoryTypeEnum.NavigationSystem, price: 900 },
    { productId: 'eq-2', equipmentName: 'Seat heating', categoryType: SpecialEquipmentDto.CategoryTypeEnum.Heating, price: 450 },
  ] as SpecialEquipmentDto[];

  it('sums selected prices and treats free items as zero', () => {
    expect(calculateTotalPrice(engine, color, rims, equipment)).toBe(34550);
  });

  it('creates ordered lines with stable product IDs and translation keys', () => {
    const lines = buildOrderLines(engine, color, rims, equipment);

    expect(lines.map(line => line.position)).toEqual([1, 2, 3, 4, 5]);
    expect(lines.map(line => line.id)).toEqual(['eng-1', 'color-1', 'rim-1', 'eq-1', 'eq-2']);
    expect(lines.map(line => line.item)).toEqual([
      'config.engine', 'config.paint', 'config.rims', 'equipment.navigation', 'equipment.heating',
    ]);
    expect(lines[1].price).toBe(0);
  });

  it('returns an empty summary when no products are selected', () => {
    expect(buildOrderLines(null, null, null, [])).toEqual([]);
    expect(calculateTotalPrice(null, null, null, [])).toBe(0);
  });
});
