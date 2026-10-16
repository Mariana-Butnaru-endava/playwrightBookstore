import { FullConfig } from "@playwright/test";
import { spawn } from "child_process";
import path from "path";

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

    const allureBin = path.resolve(process.cwd(), "node_modules/.bin/allure");
    const isWindows = process.platform === "win32";

    // Spawn allure serve as a detached process so it survives after Playwright exits.
    // On Windows the binary is allure.cmd, so we run through cmd.exe; on Unix we run
    // the shell script directly.
    const serve = isWindows
        ? spawn("cmd", ["/c", `${allureBin}.cmd`, "serve"], {
            cwd: process.cwd(),
            detached: true,
            stdio: "ignore",
            windowsHide: true,
        })
        : spawn(allureBin, ["serve"], {
            cwd: process.cwd(),
            detached: true,
            stdio: "ignore",
        });

    serve.on("error", (err) => {
        console.error("ERROR: Starting Allure server:", err.message);
    });

    serve.unref();
    // }

    console.log("--- TEARDOWN PROCESS COMPLETE ---");
}
