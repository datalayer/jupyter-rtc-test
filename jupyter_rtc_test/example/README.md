# Client and Server Examples

About the ypy_websocket start, see https://github.com/y-crdt/ypy-websocket/pull/77

This PR has breaking changes, and should probably be released as v1.0.

In particular, WebsocketProvider, WebsocketServer, YRoom and YStore must either be used with an async context manager (this is the preferred way), or using lower-level start() and stop() methods.

Before this PR, some tasks were created implicitly on instanciation. The new approach is more explicit regarding the async nature of these objects, and ensures no task is left running on tear-down. Under the hood, AnyIO's task groups are used, but ypy-websocket can be used in a "pure asyncio" environment, no need to adopt AnyIO outside of this library.

Here is an example with an async context manager:

```py
async def main():
    async with WebsocketServer():
        ...
```

Which is equivalent to the following, when using the lower-level API (with start()/stop()):

```py
async def main():
    server = WebsocketServer()
    task = asyncio.create_task(server.start())
    await server.started.wait()
    ...
    server.stop()
```
