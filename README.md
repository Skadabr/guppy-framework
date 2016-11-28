# Guppy

[![Join the chat at https://gitter.im/guppy-framework/guppy](https://img.shields.io/gitter/room/nexode/guppy-framework.svg)](https://gitter.im/guppy-framework/guppy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Guppy is a platform for micro-service development on TypeScript.

[Here](https://github.com/nexode/guppy-boilerplate) you can get a boilerplate.

```typescript
import { Get, Response } from "guppy-http";

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

## Authors

* Karabutin Alex <karabutinalex@gmail.com>

## License

[![License](https://img.shields.io/npm/l/guppy.svg)](./LICENSE)