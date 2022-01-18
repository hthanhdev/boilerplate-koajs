const input_validator = require("../middlewares/input-validator")
describe("input_validator", () => {
    test("ctx : undefined - next : undefined - schema : undefined", async () => {
        try {
            let isValid = await input_validator({
                body: {},
                throw: () => false
            }, undefined, undefined)
            expect(isValid).toBe(undefined)
        } catch (error) {}
    })

    test("ctx : body {} - next : false - schema : Hoang Thanh", async () => {
        let result = await input_validator({
            body: {},
            throw: () => false
        }, false, "Hoang Thanh")
        expect(result).toBe(undefined)
    })

    test("ctx : body {} - next : true - schema : Nguyen", async () => {
        await input_validator({
            body: {},
            throw: () => false
        }, true, "Nguyen")
    })

    test("ctx : body {} - next : true - schema : Hoang Thanh ", async () => {
        let result = await input_validator({
            body: {},
            throw: () => false
        }, true, "Hoang Thanh")
        expect(result).toBe(undefined)
    })

    test("ctx : body {} - next : false - schema : George", async () => {
        let result = await input_validator({
            body: {},
            throw: () => false
        }, true, "George")
        expect(result).toBe(undefined)
    })

    test("ctx : body {} - next : false - schema : Jean-Philippe", async () => {
        let result = await input_validator({
            body: {},
            throw: () => true
        }, false, "Jean-Philippe")
        expect(result).toBe(undefined)
    })

    test("ctx : body {} - next : true - schema : '' ", async () => {
        let result = await input_validator({
            body: {},
            throw: () => true
        }, true, "")
        expect(result).toBe(undefined)
    })
})