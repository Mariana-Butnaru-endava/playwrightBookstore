import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import { execFileSync } from "child_process"
import { log } from "./logger"
/**
 * Reads file 
 * @param filePath Reads 
 * @returns file content as string
 */
function readFile(filePath: string): any {
    if (!fs.existsSync(filePath)) {
        throw new Error(`no file exists with given name: ${filePath}`);
    }
    log("info", `Reading file: ${filePath}`);
    let data = fs.readFileSync(filePath, { encoding: "utf-8" });
    return data;
}

/**
 * Writes to target file. If target is json, stringify data
 * @param filePath 
 * @param data
 * @returns 
 * import fileHelper from 'tests/helpers/file-helper';

   fileHelper.writeFile('output/test-data.json', { name: 'Alice' });
 */
function writeFile(filePath: string, data: any) {
    const targetDir = path.dirname(filePath);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    let fileContent = data;

    if (path.extname(filePath).toLowerCase() === ".json" && typeof data !== "string") {
        fileContent = JSON.stringify(data, null, 2);
    }
    try {
        fs.writeFileSync(filePath, fileContent, { encoding: "utf-8" });
        log("info", `Writing file: ${filePath}`);
    } catch (err) {
        new Error(`Error writing to: ${filePath}, ${err}`);
    }
}

function readCSV(filePath: string): any[] {
    const csvDataStr = fs.readFileSync(filePath, { encoding: "utf-8" });
    const csvDataArr = parse(csvDataStr, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    })
    return csvDataArr;
}

/**
 * Reads an xlsx file and converts the given worksheet into an array of row objects,
 * using the first row as column headers (same shape as readCSV).
 *
 * exceljs (used to parse the workbook) only exposes an async API, but this function
 * is kept synchronous - same signature/usage as readCSV() - so it can be called at
 * spec file scope to build data-driven tests (Playwright spec files are loaded as
 * CommonJS, where top-level `await` isn't allowed). To do that, the actual parsing
 * is delegated to ./xlsx-reader-worker.js, run in a child process via execFileSync,
 * which does the async read and prints the resulting rows as JSON to stdout.
 * @param filePath path to the .xlsx file
 * @param sheetName optional worksheet name to read, defaults to the first worksheet
 * @returns array of row objects keyed by header
 */
function readXLSX(filePath: string, sheetName?: string): any[] {
    if (!fs.existsSync(filePath)) {
        throw new Error(`no file exists with given name: ${filePath}`);
    }

    const workerPath = path.resolve(__dirname, "xlsx-reader-worker.js");
    const args = sheetName ? [workerPath, filePath, sheetName] : [workerPath, filePath];
    const stdout = execFileSync(process.execPath, args, { encoding: "utf-8" });
    return JSON.parse(stdout);
}

export default { readFile, readCSV, readXLSX, writeFile };