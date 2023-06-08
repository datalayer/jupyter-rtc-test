import asyncio
import json
import random
import subprocess
import time

import threading
from multiprocessing.pool import ThreadPool

from pathlib import Path
from websockets import connect  # type: ignore

import pytest

from y_py import YDoc
from ypy_websocket import WebsocketProvider
from jupyter_ydoc import YNotebook

from ..utils import stringify_source


NOTEBOOKS_DIR = Path(__file__).parent / "notebooks"
HERE = Path(__file__).parent
NUMBER_OF_CLIENTS = 20


def custom_hook(args):
    print(f'Thread failed: {args}')

threading.excepthook = custom_hook


def run_client(value):
    time.sleep(random.randint(0, 2)) # Randomly sleep between 0 second and 2 seconds.
    p = subprocess.Popen(["node", f"{HERE}/../../../src/__tests__/clients/jupyter_ydoc_client_appender.mjs"])
    return 0


@pytest.mark.asyncio
async def test_notebook_stress(y_websocket_server):
    notebook = YNotebook()
    nb = stringify_source(json.loads((NOTEBOOKS_DIR / "simple.ipynb").read_text()))
    notebook.source = nb
    websocket = await connect("ws://127.0.0.1:1234/room_notebook_stress")
    websocket_provider = WebsocketProvider(notebook.ydoc, websocket)
    with ThreadPool() as pool:
        result = pool.map(run_client, range(NUMBER_OF_CLIENTS))
        assert (1 in result) is False
    await asyncio.sleep(5)
    cell = notebook.get_cell(0)
    source = cell.get("source")
#    assert source == "x=1"
    assert source == "C" * NUMBER_OF_CLIENTS + "print('Hello, World!')"
