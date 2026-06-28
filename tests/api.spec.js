// tests/api.spec.js
const { test, expect } = require('@playwright/test');

/**
 * API-level test suite.
 *
 * SauceDemo itself is UI-only and doesn't expose a public API, so these
 * tests target ReqRes (https://reqres.in), a free API built specifically
 * for testing/practice. The point of this suite is to demonstrate API
 * testing fundamentals independent of the UI: status codes, response
 * shape, and data validation directly against HTTP responses.
 */
test.describe('API tests', () => {
  const baseURL = 'https://reqres.in/api';

  test('GET single user returns 200 and correct shape', async ({ request }) => {
    const response = await request.get(`${baseURL}/users/2`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toHaveProperty('id', 2);
    expect(body.data).toHaveProperty('email');
    expect(body.data).toHaveProperty('first_name');
    expect(body.data).toHaveProperty('last_name');
  });

  test('GET non-existent user returns 404', async ({ request }) => {
    const response = await request.get(`${baseURL}/users/9999`);
    expect(response.status()).toBe(404);
  });

  test('GET users list returns paginated results', async ({ request }) => {
    const response = await request.get(`${baseURL}/users?page=1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('page', 1);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('POST creates a new user and returns the submitted data', async ({ request }) => {
    const newUser = { name: 'Nigar Kana', job: 'QA Analyst' };

    const response = await request.post(`${baseURL}/users`, {
      data: newUser,
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(newUser.name);
    expect(body.job).toBe(newUser.job);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  test('PUT updates an existing user', async ({ request }) => {
    const response = await request.put(`${baseURL}/users/2`, {
      data: { name: 'Nigar Kana', job: 'Senior QA Analyst' },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.job).toBe('Senior QA Analyst');
    expect(body).toHaveProperty('updatedAt');
  });

  test('DELETE removes a user and returns 204', async ({ request }) => {
    const response = await request.delete(`${baseURL}/users/2`);
    expect(response.status()).toBe(204);
  });
});