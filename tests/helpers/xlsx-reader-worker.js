/**
 * Worker script used by file-helper.ts's readXLSX() to parse an .xlsx file.
 *
 * exceljs only exposes an async API, but Playwright spec files are loaded as
 * CommonJS, where top-level `await` is not allowed - so dynamic, data-driven
 * tests (e.g. `for (const user of invUser) test(...)`) can't directly await
 * an async file read at module scope.
 *
 * To keep readXLSX() synchronous (same signature as readCSV()), this script
 * is spawned as a child process: it does the async exceljs read itself, then
 * prints the parsed rows as JSON to stdout, which the parent process reads
 * back synchronously via execFileSync.
 *
 * Usage: node xlsx-reader-worker.js <filePath> [sheetName]
 */
const ExcelJS = require("exceljs");

async function main() {
    const [filePath, sheetName] = process.argv.slice(2);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = sheetName ? workbook.getWorksheet(sheetName) : workbook.worksheets[0];

    if (!worksheet) {
        throw new Error(`no worksheet found in file: ${filePath}`);
    }

    const headerRow = worksheet.getRow(1);
    const headers = [];
    headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        headers[colNumber] = String(cell.value).trim();
    });

    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header row

        const rowData = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const header = headers[colNumber];
            if (!header) return;
            // Preserve the cell value as-is (no trimming) so intentional whitespace-only
            // values (e.g. a password of " ") survive, matching how csv-parse's trim
            // option only trims unquoted CSV fields and leaves quoted ones untouched.
            const value = cell.value;
            rowData[header] = value && typeof value === "object" && "text" in value
                ? value.text
                : (value?.toString() ?? "");
        });
        rows.push(rowData);
    });

    process.stdout.write(JSON.stringify(rows));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
