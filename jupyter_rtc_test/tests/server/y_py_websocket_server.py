import asyncio

from websockets import serve
from ypy_websocket import WebsocketServer


HOST = "127.0.0.1"
PORT = 1234


async def server():
    websocket_server = WebsocketServer()
    async with serve(websocket_server.serve, HOST, PORT):
        print(f"Ypy WebSocket server listening on {HOST}:{PORT}")
        await asyncio.Future()  # run forever

asyncio.run(server())
