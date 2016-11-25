import { Field } from "../../validation";

import assert = require("assert");

describe("guppy.validation.Field", () => {

    it("declines an invalid email", () => {
        const field = new Field("myField").isEmail();

        assert.throws(
            () => field.validate({ myField: "hello" }),
            /Field "myField" must be an email./
        );
    });

    it("accepts a valid email", () => {
        const field = new Field("myField").isEmail();

        field.validate({ myField: "alex@company.com" });
    });

    it("skips an ommited value", () => {
        const field = new Field("myField").isEmail();

        field.validate({ });
    });

    it("declines an ommited required value", () => {
        const field = new Field("myField").required();

        assert.throws(
            () => field.validate({ }),
            /Field "myField" is required./
        );
    });

    it("accepts a passed required value", () => {
        const field = new Field("myField").required();

        field.validate({ myField: "alex@company.com" });
    });

    it("declines a not string value", () => {
        const field = new Field("myField").isString();

        assert.throws(
            () => field.validate({ myField: true }),
            /Field "myField" must be a string./
        );
    });

    it("accepts a string value", () => {
        const field = new Field("myField").isString();

        field.validate({ myField: "my string" });
    });

    it("skips an ommited string", () => {
        const field = new Field("myField").isString();

        field.validate({ });
    });

    it("trims a passed value", () => {
        const field = new Field("myField").trim();
        const data = {
            myField: "   my string   "
        };

        field.validate(data);

        assert.equal(data["myField"], "my string");
    });

    it("requires a valid value as an int", () => {
        const field = new Field("myField").toInt();
        const data = {
            myField: "foo"
        };

        assert.throws(
            () => field.validate(data),
            /Field "myField" must be an integer./
        );
    });

    it("converts a passed value to an int", () => {
        const field = new Field("myField").toInt();
        const data = {
            myField: "15"
        };

        field.validate(data);

        assert.equal(data["myField"], 15);
    });

    it("converts a passed value to a Date", () => {
        const field = new Field("myField").toDate();
        const data = {
            myField: "2016-11-25T14:57:33.442Z"
        };

        field.validate(data);

        const given: Date = data["myField"] as any;

        assert.ok(given instanceof Date);
        assert.equal(given.toISOString(), "2016-11-25T14:57:33.442Z");
    });

    it("requires a date value in ISO format", () => {
        const field = new Field("myField").toDate();
        const data = {
            myField: "foo"
        };

        assert.throws(
            () => field.validate(data),
            /Field "myField" must has ISO format./
        );
    });

    it("skips an ommited string", () => {
        const field = new Field("myField").trim();
        const data = { };

        field.validate(data);

        assert.equal(data["myField"], undefined);
    });
});