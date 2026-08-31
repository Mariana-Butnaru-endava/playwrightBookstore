import { FullConfig } from "@playwright/test"
import path from "path";
import fs from "fs"

export default function globalSetup(config: FullConfig) {
    /* Executed before all the workers start. Good place to keep one-off tasks before all workers start */
    console.log("--- STARTING GLOBAL SETUP ---");
    // if (process.env.RUNNER?.toUpperCase() === "LOCAL") {
    const resultsDir = path.resolve(process.cwd(), "allure-results");
    console.log(`results directory: ${resultsDir}`);
    if (fs.existsSync(resultsDir)) {
        fs.rmSync(resultsDir, { recursive: true, force: true });
        console.log(">> Deleted allure-results folder for clean local run.");
    }
    //  }

    // Add any other global setup logic here:
    // - Database initialization
    // - Test data preparation
    // - Environment configuration
    // - External service setup
    // - Start test servers
    // set the token global variable
    process.env.LOGIN_COOKIES = undefined

    console.log("--- GLOBAL SETUP COMPLETE ---");
}
