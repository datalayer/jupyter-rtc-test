"""WsEchoHandler handlers."""

from tornado import ioloop
from tornado.websocket import WebSocketHandler

from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.base.zmqhandlers import WebSocketMixin


CONNECTED = set()


class WsRelayHandler(WebSocketMixin, WebSocketHandler, JupyterHandler):
    """WsRelayHandler"""

    def open(self, *args, **kwargs):
        """WsRelayHandler open"""
        self.log.info("WsRelayHandler opened.")
        super(WebSocketMixin, self).open(*args, **kwargs)
        CONNECTED.add(self)

    def on_message(self, message):
        """WsRelayHandler on_message"""
        self.log.info("WsRelayHandler message: " + message)
        peers = {peer for peer in CONNECTED if peer is not self}
        for peer in peers:
            peer.write_message(str(message))

    def on_close(self):
        """WsRelayHandler on_close"""
        self.log.info("WsRelayHandler closed.")
        CONNECTED.remove(self)
