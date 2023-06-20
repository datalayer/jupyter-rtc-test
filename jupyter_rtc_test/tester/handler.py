"""WsTesterHandler handler."""

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
NUMBER_OF_CLIENTS = 20


def custom_hook(args):
    print(f'Thread failed: {args}')

threading.excepthook = custom_hook


def run_client(value):
    time.sleep(random.randint(0, 2)) # Randomly sleep between 0 second and 2 seconds.
    p = subprocess.Popen(["node", f"{HERE}/../../src/__tests__/clients/stress_ui/y_websocket_client_insert.mjs"])
    return 0


class WsTesterHandler(WebSocketMixin, WebSocketHandler, JupyterHandler):
    """WsEchoHandler"""

    def do_test(self):
        self.log.info(HERE)
        doc = YDoc()
        with doc.begin_transaction() as txn:
            text = doc.get_text("t")
            text.insert(txn, 0, "S")
        websocket_provider = WebsocketProvider(doc, self)
        with ThreadPool() as pool:
            result = pool.map(run_client, range(NUMBER_OF_CLIENTS))
            self.log.info(result)

    def open(self, *args, **kwargs):
        """WebSocket open"""
        self.log.info("WebSocket opened.")
        super(WebSocketMixin, self).open(*args, **kwargs)
        self.do_test()

    def on_message(self, message):
        """WebSocket on message"""
        self.log.info("WebSocket message: " + message)
        self.write_message(str(message))

    def on_close(self):
        """WebSocket on close"""
        self.log.info("WebSocket closed")

    # CORS

    def set_default_headers(self):
        self.log.info('Setting default headers')
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET, OPTIONS')
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers", "Authorization, Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")

    def options(self):
        self.set_status(204)
        self.finish()
