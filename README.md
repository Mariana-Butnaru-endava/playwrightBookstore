# DemoQA Test Automation Framework
A **portable, scalable, beginner-friendly** test automation framework built from scratch with:

- **TypeScript**
- **Playwright**
- **Page Object Model (POM)**
- **DRY + SOLID principles**
- **GitHub Actions**
- **Allure reporting**
- **Screenshots and traces on failure**
- **UI + API + API-to-UI validation coverage**

Targets:
- UI: `https://demoqa.com/books`
- API / Swagger target: `https://demoqa.com/swagger`

## Why this stack is a strong choice
For a beginner, this is one of the best combinations because:

1. **TypeScript** helps catch errors early with strong typing.
2. **Playwright** supports UI testing and API testing in one tool.
3. **POM** keeps selectors and page behavior separate from test logic.
4. **Allure** gives a readable report with attachments.
5. **GitHub Actions** makes the framework easy to run in CI.

---

## Prerequisites for Windows
Install these before running the project:

### 1) Node.js
Install **Node.js LTS** (recommended version 20+).  
This also installs **npm**.

### 2) VS Code
Install **Visual Studio Code**.

Recommended VS Code extensions:
- Playwright Test for VSCode
- ESLint
- Prettier

### 3) Java (required for Allure CLI)
Install **JDK 8+** or newer.  
Allure command-line uses Java.

### 4) Git (recommended)
Useful for cloning and pushing to GitHub.

---

## Framework structure
```text
demoqa-playwright-ts-framework/
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── .github/
│   └── workflows/
│       └── playwright-tests.yml
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── core/
│   │   ├── api/
│   │   │   ├── accountApi.ts
│   │   │   ├── apiClient.ts
│   │   │   └── bookstoreApi.ts
│   │   ├── constants/
│   │   │   └── books.ts
│   │   └── utils/
│   │       ├── assertions.ts
│   │       └── testData.ts
│   ├── fixtures/
│   │   └── testFixtures.ts
│   └── pages/
│       ├── bookDetailsPage.ts
│       ├── booksPage.ts
│       ├── loginPage.ts
│       └── profilePage.ts
├── tests/
│   ├── api/
│   │   └── account-and-bookstore.spec.ts
│   ├── e2e/
│   │   └── api-ui-contract.spec.ts
│   └── ui/
|       ├── addBookToAccount.spec.ts
│       ├── book-catalog.spec.ts
│       └── login-and-profile.spec.ts
└── docs/
    └── setup-guide.md
```

---

## High-level design
### Page Object Model
Each page has its own class:
- `BooksPage`
- `BookDetailsPage`
- `LoginPage`
- `ProfilePage`

This keeps selectors and actions reusable.

### API layer
The API layer is split into:
- `ApiClient`
- `AccountApi`
- `BookStoreApi`

This keeps HTTP logic separate from test logic.

### Fixtures
Shared test setup is in:
- `src/fixtures/testFixtures.ts`

This lets tests reuse:
- generated users
- authenticated API clients
- cleanup logic

---

## Test coverage included
### UI scenarios
- Verify the Books page loads correctly
- Search a book and validate filtered results
- Open a book details page and validate title
- Log in with a user created by API
- Validate the profile page after successful login

### API scenarios
- Create a user
- Generate a token
- Authorize a user
- Retrieve all books
- Add books to a user
- Get user details and validate owned books
- Remove all books
- Optionally delete the user

### End-to-end API + UI scenario
- Create user via API
- Add a book via API
- Log in through UI
- Validate the same book appears on the UI profile page

---

## Setup steps
## 1) Extract the zip
Unzip the project into a folder.

## 2) Open in VS Code
Open the project folder in **VS Code**.

## 3) Create your `.env` file
Copy `.env.example` to `.env`.

On Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

## 4) Install dependencies
```bash
npm install
```

## 5) Install Playwright browsers
```bash
npx playwright install
```

## 6) Optional: Install Allure CLI
You can use either of these options:

### Option A: npm
```bash
npm install -g allure-commandline --save-dev
```

### Option B: Scoop
```powershell
scoop install allure
```

### Option C: Chocolatey
```powershell
choco install allure-commandline
```

---

## How to run tests
### Run everything
```bash
npm run test:all
```

### Run only UI tests
```bash
npm run test:ui
```

### Run only API tests
```bash
npm run test:api
```

### Run headed mode
```bash
npm run test:headed
```

---

## How to view reports
### Playwright HTML report
```bash
npm run report
```

### Allure report
Generate:
```bash
npm run allure:generate
```

Open:
```bash
npm run allure:open
```

---

## Beginner explanation: what happens in this framework?
Think of the framework as 4 layers:

1. **Tests**  
   These describe the business scenario.

2. **Pages**  
   These contain UI actions and selectors.

3. **API clients**  
   These contain backend request logic.

4. **Utilities/config**  
   These contain reusable helpers like data generation and environment values.

This makes the framework easier to maintain as the project grows.

---

## DemoQA-specific note
DemoQA registration UI typically includes a CAPTCHA, which is not suitable for stable automation.  
Because of that, this framework creates users through the **API**, then uses the created credentials for UI login. This is more reliable and more realistic for automated regression coverage.

---

## CI/CD
GitHub Actions is included at:
```text
.github/workflows/playwright-tests.yml
```

It:
- installs Node.js
- installs project dependencies
- installs Playwright browsers
- runs tests
- stores Playwright and Allure artifacts

---

## Suggested next improvements
- Add linting and formatting
- Add test tagging
- Add environment matrix (QA/UAT/Prod-like)
- Add JSON schema validation for API responses
- Add Docker support
- Add test data factories for more complex scenarios

---

## Notes about the target app
The Books UI and login/profile pages are available on DemoQA, and the site exposes a BookStore API under `/BookStore/v1/Books` plus account endpoints under `/Account/v1`, which this framework is designed around. citeturn651400search3turn651400search5turn245681search2turn245681search3
