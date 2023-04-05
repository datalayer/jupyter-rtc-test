import asyncio
from websockets import serve

from ypy_websocket import WebsocketServer


async def server():
    websocket_server = WebsocketServer()
    async with serve(websocket_server.serve, "localhost", 1234):
        await asyncio.Future()  # run forever


print("Starting y_websocket on port 1234")
asyncio.run(server())
