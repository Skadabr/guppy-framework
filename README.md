# Guppy
[![Version](https://img.shields.io/npm/v/guppy.svg)](https://www.npmjs.com/package/guppy)
[![Travis CI](https://img.shields.io/travis/nexode/guppy-framework.svg)](https://travis-ci.org/nexode/guppy-framework)
[![Coverage Status](https://img.shields.io/coveralls/nexode/guppy-framework.svg)](https://coveralls.io/github/nexode/guppy-framework)
[![Dependencies](https://img.shields.io/versioneye/d/user/projects/580f702691281513b1714232.svg)](https://www.versioneye.com/user/projects/580f702691281513b1714232)

[![Join the chat at https://gitter.im/guppy-framework/guppy](https://img.shields.io/gitter/room/nexode/guppy-framework.svg)](https://gitter.im/guppy-framework/guppy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Guppy is a platform for micro-service development on TypeScript.

[Here](https://github.com/nexode/guppy-boilerplate) you can get a boilerplate.

```typescript
import { Get, Response } from "guppy/http";

export class UserController {

    @Get("/greeting")
    public async greeting() {
        return Response.ok({ greeting: "Hello Guppy!" });
    }
}
```

## Features

* Dependency Injection Container
* HTTP Server (with controllers and routing)
* Console Commands
* Module System (allows you create your own Bundles)
* Request Validation
* Response Streaming
* Error presenters
* HTTP Middlewares
* Logger
* Native Queue supporting (AMQP)

## Roadmap

* Multithreaded HTTP server
* HTTP Client (for microservice communication)
* DBAL supporting

## Authors

* Karabutin Alex <karabutinalex@gmail.com>

## License

[![License](https://img.shields.io/npm/l/guppy.svg)](./LICENSE)