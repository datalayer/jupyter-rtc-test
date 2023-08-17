import asyncio
import json
import subprocess

import threading
from multiprocessing.pool import ThreadPool

from pathlib import Path
from websockets import connect  # type: ignore

import pytest

from jupyter_ydoc import YNotebook
from ypy_websocket import WebsocketProvider

from ..utils import stringify_source


HERE = Path(__file__).parent

NOTEBOOKS_DIR = Path(__file__).parent / "." / "notebooks"

NUMBER_OF_CLIENTS = 10

WAIT_SEC = 20


def custom_hook(args):
    print(f'Thread failed: {args}')

threading.excepthook = custom_hook


def run_client(value):
    p = subprocess.Popen(["node", f"{HERE}/../../../src/__tests__/clients/test/ynotebook-set-source.mjs"])
    return 0


@pytest.mark.asyncio
async def test_notebook_set_source(y_websocket_server):
    ynotebook = YNotebook()
    nb = stringify_source(json.loads((NOTEBOOKS_DIR / "simple.ipynb").read_text()))
    ynotebook.source = nb
    async with connect("ws://127.0.0.1:1234/set_source") as websocket, WebsocketProvider(ynotebook.ydoc, websocket):
        with ThreadPool() as pool:
            result = pool.map(run_client, range(NUMBER_OF_CLIENTS))
            assert (1 in result) is False
        await asyncio.sleep(WAIT_SEC)
        cell = ynotebook.get_cell(0)
        source = cell.get("source")
        assert source == "x=1"
