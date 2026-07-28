# Setup Guide for Beginners

## What you are building
You are running a test automation framework for a demo web application called **DemoQA Book Store**.

This framework includes:
- UI tests
- API tests
- API + UI integration tests
- reporting with Allure
- screenshots/traces on failure

---

## Installation checklist
Before you begin, make sure you have:

- Node.js installed
- npm available
- VS Code installed
- Java installed for Allure
- Internet access to download Playwright browsers

---

## Step-by-step in Windows

### Step 1: Open PowerShell in the project folder
Navigate to the folder where you extracted the zip.

### Step 2: Create `.env`
```powershell
Copy-Item .env.example .env
```

### Step 3: Install packages
```powershell
npm install
```

### Step 4: Install browser binaries
```powershell
npx playwright install
```

### Step 5: Run API tests
```powershell
npm run test:api
```

### Step 6: Run UI tests
```powershell
npm run test:ui
```

### Step 7: Open HTML report
```powershell
npm run report
```

### Step 8: Open Allure report
```powershell
npm run allure:generate
npm run allure:open
```

---

## How to open and run from VS Code
1. Open VS Code
2. Click **File > Open Folder**
3. Select the extracted project folder
4. Open the terminal in VS Code
5. Run:
```bash
npm install
npx playwright install
npm run test:all
```

---

## What to learn first
For someone starting with automation, learn in this order:

1. Playwright test syntax
2. Locators
3. Assertions
4. Page Object Model
5. Fixtures
6. API testing with Playwright
7. Reporting and CI/CD

That learning path will help you understand the framework without getting overwhelmed.
