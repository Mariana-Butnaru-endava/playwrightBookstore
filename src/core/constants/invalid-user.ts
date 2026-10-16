export default class InvalidUser {
    static provideInvalidUser() {
        return [
            { testId: "TC001", userName: "invalidUser", password: "Password123!" },
            { testId: "TC002", userName: "1234", password: " " },
            { testId: "TC003", userName: "#$%&*", password: "123" }
        ]
    }
}