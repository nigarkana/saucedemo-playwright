# SauceDemo Playwright Automation Suite

End-to-end UI automation suite for [SauceDemo](https://www.saucedemo.com), a public e-commerce demo site built for test automation practice. Built with [Playwright](https://playwright.dev/) using the Page Object Model.

![Playwright Tests](https://github.com/nigarkana/saucedemo-playwright/actions/workflows/playwright.yml/badge.svg)

## What this covers

| Suite | File | What it validates |
|---|---|---|
| Authentication | `tests/auth.spec.js` | Valid login, locked-out user, invalid credentials, required-field validation |
| Product catalog | `tests/inventory.spec.js` | Price/name sorting correctness, add-to-cart and remove-from-cart cart-count behavior |
| Checkout flow | `tests/checkout.spec.js` | Full end-to-end purchase, **tax/total calculation verification**, required-field validation, multi-item cart accuracy |

19 test cases across 3 suites, run against Chromium, Firefox, and WebKit on every push via GitHub Actions.

## Why Page Object Model

Locators and actions live in `pages/`, separate from test logic in `tests/`. If the site's markup changes, one file needs updating — not nineteen tests. This is the same structure used in production automation suites, not a one-off recorded script.

```
saucedemo-playwright/
├── pages/              # Page objects — locators & actions only
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/              # Test specs — assertions & test logic only
│   ├── auth.spec.js
│   ├── inventory.spec.js
│   └── checkout.spec.js
├── .github/workflows/
│   └── playwright.yml  # CI: runs the full suite on every push/PR
└── playwright.config.js
```

## Running locally

```bash
npm install
npx playwright install
npm test                # run full suite, headless
npm run test:headed     # watch it run in a real browser window
npm run report          # open the HTML report from the last run
```

## A test worth highlighting

`checkout.spec.js` doesn't just check that a total *renders* — it independently recalculates subtotal + tax and asserts it matches the displayed total. That's the difference between a smoke test and a test that would actually catch a pricing bug:

```js
expect(Math.round((subtotal + tax) * 100) / 100).toBeCloseTo(total, 2);
```

## CI

Every push to `main` and every pull request triggers the full cross-browser suite via GitHub Actions (see badge above). Failed runs upload a full HTML report with screenshots and video as a build artifact.

---
Built by [Nigar Kana](https://nigarkana.github.io) — Software QA Analyst.
