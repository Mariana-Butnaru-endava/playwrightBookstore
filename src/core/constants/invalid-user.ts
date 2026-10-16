/**
 * Shape of a single invalid-login test data row, whether it comes from the
 * static provider below or an external file (csv/xlsx) via file-helper's
 * readCSV()/readXLSX().
 */
export interface LoginUserRow {
    testId: string;
    userName: string;
    password: string;
    expectedMsg: string;
}

export default class InvalidUser {
    static provideInvalidUser(): LoginUserRow[] {
        return [
            { testId: "TC001", userName: "invalidUser", password: "Password123!", expectedMsg: "Invalid username or password!" },
            { testId: "TC002", userName: "1234", password: " ", expectedMsg: "Invalid username or password!" },
            { testId: "TC003", userName: "#$%&*", password: "123", expectedMsg: "Invalid username or password!" }
        ]
    }
}