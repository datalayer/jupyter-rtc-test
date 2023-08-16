import asyncio

import uvicorn

from ypy_websocket import ASGIServer, WebsocketServer


websocket_server = WebsocketServer()
app = ASGIServer(websocket_server)

async def main():
    config = uvicorn.Config("main:app", port=5000, log_level="info")
    server = uvicorn.Server(config)
    async with websocket_server:
        task = asyncio.create_task(server.serve())
        while not server.started:
            await asyncio.sleep(0)

        await asyncio.Future()  # run forever

asyncio.run(main())
