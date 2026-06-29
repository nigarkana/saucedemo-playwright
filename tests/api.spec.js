// tests/api.spec.js
const { test, expect } = require('@playwright/test');

/**
 * API-level test suite.
 *
 * SauceDemo itself is UI-only and doesn't expose a public API, so these
 * tests target JSONPlaceholder (https://jsonplaceholder.typicode.com), a
 * free fake REST API with no signup or API key required. The point of
 * this suite is to demonstrate API testing fundamentals independent of
 * the UI: status codes, response shape, and data validation directly
 * against HTTP responses.
 *
 * Note: JSONPlaceholder simulates writes (POST/PUT/DELETE) — it returns
 * realistic responses but doesn't persist changes on the server. That's
 * expected and is exactly why we assert against the response body
 * rather than re-fetching afterward.
 */
test.describe('API tests', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('GET single post returns 200 and correct shape', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts/1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
    expect(body).toHaveProperty('userId');
  });

  test('GET non-existent post returns 404', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts/9999`);
    expect(response.status()).toBe(404);
  });

  test('GET posts list returns multiple results', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET posts filtered by userId returns only that user\'s posts', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts?userId=1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
    for (const post of body) {
      expect(post.userId).toBe(1);
    }
  });

  test('POST creates a new post and returns the submitted data', async ({ request }) => {
    const newPost = {
      title: 'QA Automation Portfolio',
      body: 'Testing the POST endpoint with Playwright.',
      userId: 1,
    };

    const response = await request.post(`${baseURL}/posts`, {
      data: newPost,
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe(newPost.title);
    expect(body.body).toBe(newPost.body);
    expect(body.userId).toBe(newPost.userId);
    expect(body).toHaveProperty('id');
  });

  test('PUT updates an existing post', async ({ request }) => {
    const response = await request.put(`${baseURL}/posts/1`, {
      data: {
        id: 1,
        title: 'Updated title',
        body: 'Updated body content.',
        userId: 1,
      },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.title).toBe('Updated title');
    expect(body.body).toBe('Updated body content.');
  });

  test('DELETE removes a post and returns 200', async ({ request }) => {
    const response = await request.delete(`${baseURL}/posts/1`);
    expect(response.status()).toBe(200);
  });
});