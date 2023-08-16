import asyncio
import random
import subprocess
import time

from pathlib import Path
from websockets import connect  # type: ignore

import threading
from threading import Lock
from multiprocessing.pool import ThreadPool

import pytest

from y_py import YDoc
from ypy_websocket import WebsocketProvider


ydoc = YDoc()
lock = Lock()

HERE = Path(__file__).parent
NUMBER_OF_CLIENTS = 20


def custom_hook(args):
    print(f'Thread failed: {args}')

threading.excepthook = custom_hook


def run_client(value):
    time.sleep(random.randint(0, 2)) # Randomly sleep between 0 second and 2 seconds.
    p = subprocess.Popen(["node", f"{HERE}/../../../src/__tests__/clients/cli/text-delete.mjs"])
    return 0


@pytest.mark.asyncio
async def test_ypy_websocket_delete(y_websocket_server):
#    websocket = await connect("ws://127.0.0.1:1234/jupyter_rtc_test")
    async with connect("ws://127.0.0.1:1234/room-0") as websocket, WebsocketProvider(
        ydoc, websocket
    ):
        with ydoc.begin_transaction() as txn:
            text = ydoc.get_text("t")
            text.insert(txn, 0, "S")
        websocket_provider = WebsocketProvider(ydoc, websocket)
        with ThreadPool() as pool:
            result = pool.map(run_client, range(NUMBER_OF_CLIENTS))
            assert (1 in result) is False
        await asyncio.sleep(10)
        text = str(ydoc.get_text("t"))
        print(text)
        clients_count = text.count('C')
        assert clients_count == NUMBER_OF_CLIENTS
        server_count = text.count('S')
        assert server_count == 1
