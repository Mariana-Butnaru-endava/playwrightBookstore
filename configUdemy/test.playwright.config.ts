import { defineConfig, devices } from '@playwright/test';
import { baseConfig } from "../playwright.config.ts";
import { EnvConfig } from "../tests/helpers/config-fixtures.ts"
import path from 'path';

console.log(`=======LOADING QA ENV=====`);

export default defineConfig<EnvConfig>({
    ...baseConfig, //loads base config values
    testDir: path.resolve(process.cwd(), "./tests"),

    use: {
        ...baseConfig.use,
        envName: "QA",
        appURL: "https://demoqa.com/login",
        nopCommerceWeb: "https://admin-demo.nopcommerce.com",
        dbConfig: {
            server: "",
            dbname: "",
            connectionStr: ""
        }
    }
})