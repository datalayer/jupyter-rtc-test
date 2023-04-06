import asyncio
from websockets import serve

from ypy_websocket import WebsocketServer


class bcolors:
    YELLOW = '\x1b[33m'
    ENDC = '\033[0m'

async def server():
    websocket_server = WebsocketServer()
    async with serve(websocket_server.serve, "localhost", 1234):
        await asyncio.Future()  # run forever


print(f"Starting y_websocket on port {bcolors.YELLOW}1234{bcolors.ENDC}")

asyncio.run(server())
