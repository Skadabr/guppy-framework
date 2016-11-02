import { Log4jsLogger } from "../../../core/logger/Log4jsLogger";

describe("guppy.core.logger.Log4jsLogger", () => {

    it("can be instantiated", () => {

        const logger = new Log4jsLogger();

        logger.trace("");
        logger.debug("");
        logger.info("");
        logger.warn("");
        logger.error("");
        logger.fatal("");
    });
});
