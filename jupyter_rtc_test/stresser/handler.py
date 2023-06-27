"""Stresser handler."""

import json

from tornado.websocket import WebSocketHandler

import subprocess

from pathlib import Path

import threading
from multiprocessing.pool import ThreadPool

from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.base.zmqhandlers import WebSocketMixin

from y_py import YDoc
from ypy_websocket import WebsocketProvider


HERE = Path(__file__).parent


CONNECTED = set()


def custom_hook(args):
    print(f'Thread failed: {args}')

threading.excepthook = custom_hook


def run_nodejs_client(id, script, textLength, warmupPeriodSeconds):
    nodejs_process = subprocess.Popen(["node", f"{HERE}/../../src/__tests__/clients/stress-ui/" + script, str(id), textLength, warmupPeriodSeconds])
    return nodejs_process


def run_python_client(id, script, textLength, warmupPeriodSeconds):
    python_process = subprocess.Popen(["python", f"{HERE}/clients/" + script, str(id), textLength, warmupPeriodSeconds])
    return python_process


class WsStresserHandler(WebSocketMixin, WebSocketHandler, JupyterHandler):
    """WsStresser Handler"""

    doc = YDoc()

    nodejs_pool = ThreadPool()
    nodejs_processes = []

    python_pool = ThreadPool()
    python_processes = []


    @property
    def path(self):
        """
        Returns the room id. It needs to be called 'path' for compatibility with
        the WebsocketServer (websocket.path).
        """
        return "jupyter_rtc_test"


    async def send(self, message):
        """
        Send a message to the client.
        """
        # needed to be compatible with WebsocketServer (websocket.send)
#        try:
#            self.write_message(message, binary=True)
#        except Exception as e:
#            self.log.debug("Failed to write message", exc_info=e)
        pass


    def _start_stress(self, scenario):
        self.log.info('Starting stress tests.')
        WsStresserHandler.nodejs_pool = ThreadPool()
        WsStresserHandler.python_pool = ThreadPool()
        WsStresserHandler.doc = YDoc()
        websocket_provider = WebsocketProvider(WsStresserHandler.doc, self)
#        with WsStresserHandler.doc.begin_transaction() as txn:
#            text = WsStresserHandler.doc.get_text("t")
#            text.insert(txn, 0, "S")
        nodejs_args = [(i, scenario['nodejsScript'], str(scenario['textLength']), str(scenario['warmupPeriodSeconds'])) for i in range(scenario['numberNodejsClients'])]
        nodejs_result = WsStresserHandler.nodejs_pool.starmap(run_nodejs_client, nodejs_args)
        WsStresserHandler.nodejs_processes = nodejs_result
        python_args = [(i, scenario['pythonScript'], str(scenario['textLength']), str(scenario['warmupPeriodSeconds'])) for i in range(scenario['numberPythonClients'])]
        python_result = WsStresserHandler.python_pool.starmap(run_python_client, python_args)
        WsStresserHandler.python_processes = python_result

    def _stop_stress(self):
        self.log.info('Stopping stress tests.')
        for nodejs_process in WsStresserHandler.nodejs_processes:
            self.log.info("Killing nodejs process with pid %s " % nodejs_process.pid)
            nodejs_process.kill()
        WsStresserHandler.nodejs_processes = []
        WsStresserHandler.nodejs_pool.close()
        for python_process in WsStresserHandler.python_processes:
            self.log.info("Killing python process with pid %s " % python_process.pid)
            python_process.kill()
        WsStresserHandler.python_processes = []
        WsStresserHandler.python_pool.close()

    def open(self, *args, **kwargs):
        """WsStresser Handler open."""
        super(WebSocketMixin, self).open(*args, **kwargs)
        self.log.info("WsStresser Handler opened.")
        CONNECTED.add(self)

    def on_message(self, m):
        """WsStresser Handler on message."""
        payload = str(m)
        self.log.debug('WsStresser Handler message payload: ' + m)
        message = json.loads(payload)
        action = message['action']
        if action == 'start':
            self._start_stress(message['scenario'])
        elif action == 'stop':
            self._stop_stress()
        elif action == 'info':
            peers = { peer for peer in CONNECTED if peer is not self }
            for peer in peers:
                peer.write_message(message)
        elif action == 'pause':
            peers = { peer for peer in CONNECTED if peer is not self }
            for peer in peers:
                peer.write_message(message)
        elif action == 'restart':
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
