import { test as base } from '@playwright/test';

export type EnvConfig = {
    envName: string,
    appURL: string,
    nopCommerceWeb: string,
    dbConfig: {}
}

export const test = base.extend<EnvConfig>({
    envName: ["test", { option: true }],
    appURL: ["<provideURL>", { option: true }],
    nopCommerceWeb: ["<provideURL>", { option: true }],
    dbConfig: [{}, { option: true }],
})