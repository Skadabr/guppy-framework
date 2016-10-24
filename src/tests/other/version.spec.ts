import assert = require("assert");
import fs = require("fs");

import { VERSION } from "../..";

describe("guppy", () => {

    it("contains an actual version number", (done) => {

        fs.readFile(`${__dirname}/../../../package.json`, (err, data) => {

            if (err) throw err;

            const packageDetails = JSON.parse(
                data.toString()
            );

            assert.equal(VERSION, packageDetails["version"]);
            done();
        });
    });

});