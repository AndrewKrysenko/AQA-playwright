import { test, expect } from '@playwright/test';
import { createTestUser } from '../helpers/test-user.js';

async function findAudiTt(request) {
  const brandsResponse = await request.get('/api/cars/brands');
  expect(brandsResponse.status()).toBe(200);
  const brandsBody = await brandsResponse.json();
  const audi = brandsBody.data.find((brand) => brand.title === 'Audi');
  expect(audi).toBeDefined();

  const modelsResponse = await request.get(`/api/cars/models?carBrandId=${audi.id}`);
  expect(modelsResponse.status()).toBe(200);
  const modelsBody = await modelsResponse.json();
  const tt = modelsBody.data.find((model) => model.title === 'TT');
  expect(tt).toBeDefined();

  return { brand: audi, model: tt };
}

test.describe('POST /api/cars', () => {
  test.beforeEach(async ({ request }) => {
    const signupResponse = await request.post('/api/auth/signup', {
      data: createTestUser(),
    });
    expect(signupResponse.status()).toBe(201);

    const signupBody = await signupResponse.json();
    expect(signupBody.status).toBe('ok');
    expect(signupBody.data.userId).toBeGreaterThan(0);
  });

  test('creates a car with valid data', async ({ request }) => {
    const { brand, model } = await findAudiTt(request);
    const car = {
      carBrandId: brand.id,
      carModelId: model.id,
      mileage: 123,
    };

    const response = await request.post('/api/cars', { data: car });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.data.id).toBeGreaterThan(0);
    expect(body.data).toMatchObject({
      ...car,
      initialMileage: car.mileage,
      brand: brand.title,
      model: model.title,
    });
  });

  test('rejects mileage outside the supported range', async ({ request }) => {
    const { brand, model } = await findAudiTt(request);
    const response = await request.post('/api/cars', {
      data: {
        carBrandId: brand.id,
        carModelId: model.id,
        mileage: -1,
      },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      status: 'error',
      message: 'Mileage has to be from 0 to 999999',
    });
  });

  test('rejects a request missing the required carBrandId field', async ({ request }) => {
    const { model } = await findAudiTt(request);
    const response = await request.post('/api/cars', {
      data: {
        carModelId: model.id,
        mileage: 123,
      },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      status: 'error',
      message: 'Car brand id is required',
    });
  });
});
