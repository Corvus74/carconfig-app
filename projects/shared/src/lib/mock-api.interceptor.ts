import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

const enabled = (): boolean =>
  typeof localStorage !== 'undefined' && localStorage.getItem('carconfig:mockApi') === 'true';

const colors = [
  { productId: 'color-white', colorName: 'Pure White', description: 'Uni', price: 0, materialType: 'GLOSSY', paintingType: 'BASE', colorCodeHex: '#f4f4f2' },
  { productId: 'color-blue', colorName: 'Ocean Blue', description: 'Metallic', price: 950, materialType: 'GLOSSY', paintingType: 'PREMIUM', colorCodeHex: '#174b78' },
  { productId: 'color-red', colorName: 'Sunset Red', description: 'Metallic', price: 850, materialType: 'GLOSSY', paintingType: 'SPECIAL', colorCodeHex: '#9f2638' },
];
const engines = [
  { productId: 'engine-gas', model: '2.0 TSI', description: 'Gasoline, 150 kW', fuelType: 'GASOLINE', engineType: '2.0 TSI', price: 32000, displacementL: 2, cylinders: 4, horsepowerKw: 150, torqueNm: 320, drivetrain: 'FWD', co2: 145 },
  { productId: 'engine-hybrid', model: '1.5 eHybrid', description: 'Hybrid, 150 kW', fuelType: 'HYBRID', engineType: '1.5 eHybrid', price: 36500, displacementL: 1.5, cylinders: 4, horsepowerKw: 150, torqueNm: 350, drivetrain: 'FWD', co2: 35 },
  { productId: 'engine-electric', model: 'Electric 210', description: 'Electric, 210 kW', fuelType: 'ELECTRIC', engineType: 'Electric', price: 42000, horsepowerKw: 210, torqueNm: 545, drivetrain: 'RWD', co2: 0 },
];
const rims = [
  { productId: 'rim-18', rimName: 'Aero 18 in', model: 'Aero', description: 'Alloy wheel', innerDiameter: 18, price: 0 },
  { productId: 'rim-19', rimName: 'Sport 19 in', model: 'Sport', description: 'Alloy wheel', innerDiameter: 19, price: 1200 },
];
const equipment = [
  { productId: 'eq-nav', equipmentName: 'Navigation system', description: 'Navigation with online services', categoryType: 'NAVIGATION_SYSTEM', equipmentLocation: 'INTERIOR', price: 900 },
  { productId: 'eq-seat-heat', equipmentName: 'Front seat heating', description: 'Heated front seats', categoryType: 'HEATING', equipmentLocation: 'INTERIOR', price: 450 },
  { productId: 'eq-camera', equipmentName: 'Rear-view camera', description: 'Camera with parking assistance', categoryType: 'MISC', equipmentLocation: 'EXTERIOR', price: 350 },
  { productId: 'eq-audio', equipmentName: 'Sound system', description: 'Premium sound system', categoryType: 'MULTIMEDIA', equipmentLocation: 'INTERIOR', price: 700 },
];

type OrderDraft = { carOrderId?: string; userMail?: string; carEngineProductId?: string; carRimsProductId?: string; carColorProductId?: string; price?: number; specialEquipmentProductIds?: string[] };
const readOrders = (): OrderDraft[] => {
  try { return JSON.parse(localStorage.getItem('carconfig:mockOrders') ?? '[]') as OrderDraft[]; }
  catch { return []; }
};
const saveOrders = (orders: OrderDraft[]): void => localStorage.setItem('carconfig:mockOrders', JSON.stringify(orders));
const response = (body: unknown) => of(new HttpResponse({ status: 200, body }));

/** Local, browser-only API for UI and workflow development. Enable with the documented localStorage flag. */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!enabled()) return next(req);

  const path = new URL(req.url, typeof location === 'undefined' ? 'http://localhost' : location.origin).pathname;
  if (path.endsWith('/auth/login') && req.method === 'POST') {
    return response({ token: 'mock-token', expiresIn: 3600 });
  }
  if (path.endsWith('/auth/signup') && req.method === 'POST') {
    return response({ status: 'SUCCESS', text: 'Mock account created.' });
  }
  if (path.endsWith('/config/init')) return response({ carColors: colors, carEngines: engines, carRims: rims, specialEquipment: equipment });
  if (path.endsWith('/car-color/all')) return response(colors);
  if (path.endsWith('/car-engine/all')) return response(engines);
  if (path.endsWith('/car-rims/all')) return response(rims);
  if (path.endsWith('/specialEquipment/all')) return response(equipment);
  if (path.endsWith('/productInfo/getInfo') && req.method === 'POST') {
    const ids = (req.body ?? {}) as { carEngineProductId?: string; carRimsProductId?: string; carColorProductId?: string; specialEquipmentProductIds?: string[] };
    return response({
      carEngine: engines.find(x => x.productId === ids.carEngineProductId),
      carRim: rims.find(x => x.productId === ids.carRimsProductId),
      carColor: colors.find(x => x.productId === ids.carColorProductId),
      specialEquipment: equipment.filter(x => ids.specialEquipmentProductIds?.includes(x.productId)),
    });
  }
  if (path.endsWith('/user/add') && req.method === 'POST') return response({ status: 'SUCCESS', text: 'Mock user saved.' });
  if (/\/user\/get\//.test(path) && req.method === 'GET') {
    const email = decodeURIComponent(path.split('/').pop() ?? '');
    return response({ userName: 'Demo Nutzer', email, role: 'USER' });
  }
  if (path.endsWith('/order/create') && req.method === 'POST') {
    const orders = readOrders();
    const orderId = `MOCK-${Date.now()}`;
    orders.push({ ...(req.body as OrderDraft), carOrderId: orderId });
    saveOrders(orders);
    return response({ status: 'SUCCESS', text: 'Mock order saved.', orderId });
  }
  if (path.endsWith('/order/update') && req.method === 'PUT') {
    const draft = req.body as OrderDraft;
    const orders = readOrders();
    const orderId = draft.carOrderId ?? `MOCK-${Date.now()}`;
    const index = orders.findIndex(order => order.carOrderId === orderId);
    if (index < 0) orders.push({ ...draft, carOrderId: orderId }); else orders[index] = { ...draft, carOrderId: orderId };
    saveOrders(orders);
    return response({ status: 'SUCCESS', text: 'Mock order updated.', orderId });
  }
  const orderId = decodeURIComponent(path.split('/').pop() ?? '');
  if (path.includes('/order/byId/') && req.method === 'GET') {
    const draft = readOrders().find(order => order.carOrderId === orderId);
    if (!draft) return response({});
    return response({ ...draft, orderUser: { email: draft.userMail, userName: 'Demo Nutzer', role: 'USER' }, orderStatus: { currentStatus: 'RECEIVED' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  if (path.includes('/order/delete/') && req.method === 'DELETE') {
    saveOrders(readOrders().filter(order => order.carOrderId !== orderId));
    return response({ status: 'SUCCESS', text: 'Mock order deleted.' });
  }
  return next(req);
};
