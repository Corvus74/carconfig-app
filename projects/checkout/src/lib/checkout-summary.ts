import { CarColorDto, CarEngineDto, CarRimDto, SpecialEquipmentDto } from '@carconfig/api-client';

export interface OrderLine {
  position: number;
  id: string;
  item: string;
  description: string;
  price: number;
}

export function buildOrderLines(
  engine: CarEngineDto | null,
  color: CarColorDto | null,
  rims: CarRimDto | null,
  equipment: SpecialEquipmentDto[],
): OrderLine[] {
  const lines: OrderLine[] = [];
  const addLine = (item: string, description: string | undefined, id: string | undefined, price: number | undefined) => {
    lines.push({
      position: lines.length + 1,
      id: id || '—',
      item,
      description: description || '—',
      price: price ?? 0,
    });
  };

  if (engine) addLine('config.engine', engine.model || engine.description, engine.productId, engine.price);
  if (color) addLine('config.paint', color.colorName || color.description, color.productId, color.price);
  if (rims) addLine('config.rims', rims.rimName || rims.model, rims.productId, rims.price);
  for (const item of equipment) {
    addLine(equipmentCategoryKey(item.categoryType), item.equipmentName || item.description, item.productId, item.price);
  }

  return lines;
}

export function calculateTotalPrice(
  engine: CarEngineDto | null,
  color: CarColorDto | null,
  rims: CarRimDto | null,
  equipment: SpecialEquipmentDto[],
): number {
  return [engine, color, rims, ...equipment]
    .reduce((total, item) => total + (item?.price ?? 0), 0);
}

function equipmentCategoryKey(category: string | undefined): string {
  const categoryKeys: Record<string, string> = {
    MULTIMEDIA: 'equipment.multimedia',
    SEATS: 'equipment.seats',
    HEATING: 'equipment.heating',
    AIR_CONDITION: 'equipment.airCondition',
    NAVIGATION_SYSTEM: 'equipment.navigation',
    STEERING_WHEEL: 'equipment.steeringWheel',
    MISC: 'equipment.misc',
  };
  return category ? categoryKeys[category] ?? 'config.equipment' : 'config.equipment';
}
