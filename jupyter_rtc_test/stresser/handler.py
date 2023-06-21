"""Stresser handler."""

from tornado import ioloop
from tornado.websocket import WebSocketHandler

import random
import subprocess
import time

from pathlib import Path

import threading
from multiprocessing.pool import ThreadPool

from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.base.zmqhandlers import WebSocketMixin

from y_py import YDoc
from ypy_websocket import WebsocketProvider


HERE = Path(__file__).parent
NUMBER_OF_CLIENTS = 10


CONNECTED = set()


def custom_hook(args):
    print(f'Thread failed: {args}')

threading.excepthook = custom_hook


def run_client(value):
    time.sleep(random.randint(0, 2)) # Randomly sleep between 0 second and 2 seconds.
    p = subprocess.Popen(["node", f"{HERE}/../../src/__tests__/clients/stress_ui/y_websocket_client_insert.mjs", str(value)])
    return 0


class WsStresserHandler(WebSocketMixin, WebSocketHandler, JupyterHandler):
    """WsStresserHandler"""

    doc = YDoc()
    pool = ThreadPool()

    def _start_stress(self):
        self.log.info('Starting stress.')
        WsStresserHandler.doc = YDoc()
        with WsStresserHandler.doc.begin_transaction() as txn:
            text = WsStresserHandler.doc.get_text("t")
            text.insert(txn, 0, "S")
        websocket_provider = WebsocketProvider(WsStresserHandler.doc, self)
        result = WsStresserHandler.pool.map(run_client, range(NUMBER_OF_CLIENTS))
        self.log.info(result)

    def _stop_stress(self):
        self.log.info('Stopping stress.')
        WsStresserHandler.pool.stop()
        pool = ThreadPool()

    def open(self, *args, **kwargs):
        """WsStresserHandler open"""
        self.log.info("WsStresserHandler opened.")
        super(WebSocketMixin, self).open(*args, **kwargs)
        CONNECTED.add(self)

    def on_message(self, m):
        """WsStresserHandler on message"""
        message = str(m)
        self.log.info("WsStresserHandler message: " + message)
        if message == 'start':
            self._start_stress()
        elif message == 'stop':
            self._stop_stress()
        elif message.startswith('info:'):
            peers = {peer for peer in CONNECTED if peer is not self}
            self.log.info(peers)
            for peer in peers:
                peer.write_message(message)
        else:
            self.write_message(message)

    def on_close(self):
        """WsStresserHandler on close"""
        self.log.info("WsStresserHandler closed")
        CONNECTED.remove(self)

    # CORS

#    def check_origin(self, origin):
#        return True

    def set_default_headers(self):
        self.log.info('Setting default headers')
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET, OPTIONS')
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers", "Authorization, Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")

    def options(self):
        self.set_status(204)
        self.finish()
