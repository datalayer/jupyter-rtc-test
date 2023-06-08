import uvicorn

from ypy_websocket import WebsocketServer
from ypy_websocket.asgi import Server


HOST = "127.0.0.1"
PORT = 1234

websocket_server = WebsocketServer()
app = Server(websocket_server)


if __name__ == "__main__":
    print(f"Ypy WebSocket ASGI server listening on {HOST}:{PORT}")
    uvicorn.run("main:app", host=HOST, port=PORT, log_level="info")
