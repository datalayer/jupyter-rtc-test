import asyncio
import websockets

HOST = "127.0.0.1"
PORT = 1234

connected = set()

async def server_handler(websocket):
    connected.add(websocket)
    try:
        async for message in websocket:
            peers = {peer for peer in connected if peer is not websocket}
            websockets.broadcast(peers, message)

    except websockets.exceptions.ConnectionClosedError: 
        pass
    finally:
        connected.remove(websocket)


async def main():
    async with websockets.serve(server_handler, HOST, PORT):
        print(f"WebSocket server listening on {HOST}:{PORT}")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
