const jwt_verify = require("./jwt-verify")
describe("jwt_verify", () => {
    test("Token invalid", async () => {
        let isValid = await jwt_verify({
            state: {
                loginInfo: {
                    web: "http://www.example.com/route/123?foo=bar",
                    token: ")]}"
                }
            },
            request: {
                web: "https://croplands.org/app/a/reset?token=",
                token: "</s>"
            },
            throw: () => true
        }, () => true)
        expect(isValid).toBe(true)
    })

    test("Throw false - Next true", async () => {
        let isValid = await jwt_verify({
            state: {
                loginInfo: {
                    web: "https://api.telegram.org/bot",
                    token: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEyNSwicGhvbmUiOiIwMzM4OTE1NDI5IiwiZW1haWwiOiJuZ2hvYW5ndGhhbmgxMjEyQGdtYWlsLmNvbSIsInR5cGUiOjEsIm5hbWUiOiJUaGFuaCIsImlhdCI6MTY0MjQ1ODgyM30.pU_0WQegoFmtD9ZfTiK3M44OFi3VqYYszxFgGhe1jGDqMgP6RJu0nIMlziZENDprxURbTy9sUsesJ8tmHusL_A"
                }
            },
            request: {
                web: "google.com",
                token: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEyNSwicGhvbmUiOiIwMzM4OTE1NDI5IiwiZW1haWwiOiJuZ2hvYW5ndGhhbmgxMjEyQGdtYWlsLmNvbSIsInR5cGUiOjEsIm5hbWUiOiJUaGFuaCIsImlhdCI6MTY0MjQ1ODgyM30.pU_0WQegoFmtD9ZfTiK3M44OFi3VqYYszxFgGhe1jGDqMgP6RJu0nIMlziZENDprxURbTy9sUsesJ8tmHusL_A"
            },
            throw: () => false
        }, () => true)
        expect(isValid).toBe(false)
    })

    test("Throw false - Next false", async () => {
        let isValid = await jwt_verify({
            throw: () => false
        }, () => false)
        expect(isValid).toBe(false)
    })

    test("Throw false - Next true", async () => {
        let isValid = await jwt_verify({
            state: {
                loginInfo: {
                    web: "https://api.telegram.org/bot",
                    token: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEyNSwicGhvbmUiOiIwMzM4OTE1NDI5IiwiZW1haWwiOiJuZ2hvYW5ndGhhbmgxMjEyQGdtYWlsLmNvbSIsInR5cGUiOjEsIm5hbWUiOiJUaGFuaCIsImlhdCI6MTY0MjQ1ODgyM30.pU_0WQegoFmtD9ZfTiK3M44OFi3VqYYszxFgGhe1jGDqMgP6RJu0nIMlziZENDprxURbTy9sUsesJ8tmHusL_A"
                }
            },
            request: {
                web: "google.com",
                token: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEyNSwicGhvbmUiOiIwMzM4OTE1NDI5IiwiZW1haWwiOiJuZ2hvYW5ndGhhbmgxMjEyQGdtYWlsLmNvbSIsInR5cGUiOjEsIm5hbWUiOiJUaGFuaCIsImlhdCI6MTY0MjQ1ODgyM30.pU_0WQegoFmtD9ZfTiK3M44OFi3VqYYszxFgGhe1jGDqMgP6RJu0nIMlziZENDprxURbTy9sUsesJ8tmHusL_A"
            },
            throw: () => true
        }, () => true)
        expect(isValid).toBe(true)
    })
})