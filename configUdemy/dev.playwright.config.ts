import { defineConfig, devices } from '@playwright/test';
import { baseConfig } from "../playwright.config.ts";
import { EnvConfig } from "../tests/helpers/config-fixtures.ts"
import path from 'path';

console.log(`=======LOADING DEV ENV======`);

export default defineConfig<EnvConfig>({
    ...baseConfig, //loads base config values
    testDir: path.resolve(process.cwd(), "./tests"),

    use: {
        ...baseConfig.use,
        envName: "devEnv",
        appURL: "https://dev.demoqa.com/login",
        dbConfig: {
            server: "",
            dbname: "",
            connectionStr: ""
        }
    }
})