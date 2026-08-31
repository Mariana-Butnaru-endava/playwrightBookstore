import { FullConfig } from "@playwright/test";
import { exec } from "child_process";

export default async function globalTeardown(config: FullConfig) {
    /* Executed after all workers complete. Good place for cleanup tasks */
    console.log("--- STARTING TEARDOWN PROCESS ---");

    /**
     * This can be used to:
     * - Release the database connection
     * - Reset application state. e.g. Delete a created record/transaction so you can re-use
     * - Temp folder/files clean up
     * - Generate and open reports
     */

    // Generate Allure report for local runs
    //if (process.env.RUNNER?.toUpperCase() === "LOCAL") {
    console.log(" >> Local run detected - starting Allure server...");
    exec("allure serve", (error, stdout, stderr) => {
        if (error) {
            console.error("ERROR: Starting Allure server:", error.message);
        }
    });
    // }

    console.log("--- TEARDOWN PROCESS COMPLETE ---");
}