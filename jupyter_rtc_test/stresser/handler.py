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

NUMBER_OF_CLIENTS = 40

CONNECTED = set()


def custom_hook(args):
    print(f'Thread failed: {args}')

threading.excepthook = custom_hook


def run_nodejs_client(value):
    time.sleep(random.randint(0, 10)) # Random warmup period.
    nodejs_process = subprocess.Popen(["node", f"{HERE}/../../src/__tests__/clients/stress_ui/y_websocket_client_insert.mjs", str(value)])
    return nodejs_process


def run_python_client(value):
    time.sleep(random.randint(0, 10)) # Random warmup period.
    python_process = subprocess.Popen(["python", f"{HERE}/clients/client_insert.py", str(value)])
    return python_process


class WsStresserHandler(WebSocketMixin, WebSocketHandler, JupyterHandler):
    """WsStresser Handler"""

    doc = YDoc()

    nodejs_pool = ThreadPool()
    nodejs_processes = []

    python_pool = ThreadPool()
    python_processes = []


    def _start_stress(self):
        self.log.info('Starting stress tests.')
        WsStresserHandler.doc = YDoc()
        with WsStresserHandler.doc.begin_transaction() as txn:
            text = WsStresserHandler.doc.get_text("t")
            text.insert(txn, 0, "S")
        websocket_provider = WebsocketProvider(WsStresserHandler.doc, self)
        nodejs_result = WsStresserHandler.nodejs_pool.map(run_nodejs_client, range(NUMBER_OF_CLIENTS))
        WsStresserHandler.nodejs_processes = nodejs_result
#        python_result = WsStresserHandler.python_pool.map(run_python_client, range(NUMBER_OF_CLIENTS))
#        WsStresserHandler.python_processes = python_result

    def _stop_stress(self):
        self.log.info('Stopping stress tests.')
        for nodejs_process in WsStresserHandler.nodejs_processes:
            self.log.info("Killing nodejs process with pid %s " % nodejs_process.pid)
            nodejs_process.kill()
        WsStresserHandler.nodejs_pool.close()
        WsStresserHandler.nodejs_pool = ThreadPool()
        for python_process in WsStresserHandler.python_processes:
            self.log.info("Killing python process with pid %s " % python_process.pid)
            python_process.kill()
        WsStresserHandler.python_pool.close()
        WsStresserHandler.pyton_pool = ThreadPool()

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
