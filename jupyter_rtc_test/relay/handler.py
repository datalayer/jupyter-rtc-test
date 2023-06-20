"""WsEchoHandler handlers."""

from tornado import ioloop
from tornado.websocket import WebSocketHandler

from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.base.zmqhandlers import WebSocketMixin

connected = set()

class WsRelayHandler(WebSocketMixin, WebSocketHandler, JupyterHandler):
    """WsEchoHandler"""

    def open(self, *args, **kwargs):
        """open"""
        print("WebSocket opened.")
        super(WebSocketMixin, self).open(*args, **kwargs)
        connected.add(self)

    def on_message(self, message):
        """on_message"""
        self.log.info("WebSocket message: " + message)
        peers = {peer for peer in connected if peer is not self}
        for peer in peers:
            peer.write_message(str(message))

    def on_close(self):
        """on_close"""
        self.log.info("WebSocket closed.")
        connected.remove(self)
