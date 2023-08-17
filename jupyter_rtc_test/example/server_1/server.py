import asyncio

from websockets import serve

from ypy_websocket import WebsocketServer


async def server():
    async with (
        WebsocketServer() as websocket_server,
        serve(websocket_server.serve, "localhost", 1234),
    ):
        await asyncio.Future()  # run forever

asyncio.run(server())
