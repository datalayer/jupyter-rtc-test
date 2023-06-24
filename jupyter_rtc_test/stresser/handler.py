"""Stresser handler."""

import json

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
CONNECTED = set()


def custom_hook(args):
    print(f'Thread failed: {args}')

threading.excepthook = custom_hook


def run_client(value):
    time.sleep(random.randint(0, 20)) # Randomly sleep between 0 second and 2 seconds.
    proc = subprocess.Popen(["node", f"{HERE}/../../src/__tests__/clients/stress_ui/y_websocket_client_insert.mjs", str(value)])
    return proc


class WsStresserHandler(WebSocketMixin, WebSocketHandler, JupyterHandler):
    """WsStresser Handler"""

    doc = YDoc()
    pool = ThreadPool()

    def _start_stress(self):
        self.log.info('Starting stress tests.')
        WsStresserHandler.doc = YDoc()
        with WsStresserHandler.doc.begin_transaction() as txn:
            text = WsStresserHandler.doc.get_text("t")
            text.insert(txn, 0, "S")
        websocket_provider = WebsocketProvider(WsStresserHandler.doc, self)
        result = WsStresserHandler.pool.map(run_client, range(NUMBER_OF_CLIENTS))
        self.log.info(result)

    def _stop_stress(self):
        self.log.info('Stopping stress tests.')
        WsStresserHandler.pool.close()
        WsStresserHandler.pool = ThreadPool()

    def open(self, *args, **kwargs):
        """WsStresser Handler open."""
        self.log.info("WsStresser Handler opened.")
        super(WebSocketMixin, self).open(*args, **kwargs)
        CONNECTED.add(self)

    def on_message(self, m):
        """WsStresser Handler on message."""
        payload = str(m)
        self.log.info('WsStresser Handler message payload: ' + m)
        message = json.loads(payload)
        action = message['action']
        if action == 'start':
            self._start_stress()
        elif action == 'stop':
            self._stop_stress()
        elif action == 'info':
            peers = { peer for peer in CONNECTED if peer is not self }
            for peer in peers:
                peer.write_message(message)
        else:
            self.write_message(message)

    def on_close(self):
        """WsStresser Handler on close."""
        self.log.info("WsStresser Handler closed.")
        CONNECTED.remove(self)

    # CORS

#    def check_origin(self, origin):
#        return True

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header('Access-Control-Allow-Methods', "POST, PUT, DELETE, GET, OPTIONS")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers", "Authorization, Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")

    def options(self):
        self.set_status(204)
        self.finish()
