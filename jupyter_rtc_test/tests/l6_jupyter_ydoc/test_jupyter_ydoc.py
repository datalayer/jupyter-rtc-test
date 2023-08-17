import json
import pytest

from pathlib import Path
from websockets import connect  # type: ignore

from y_py import YDoc
from ypy_websocket import WebsocketProvider
from jupyter_ydoc import YNotebook

from ..utils import stringify_source
from .utils.tester import YTester


NOTEBOOKS_DIR = Path(__file__).parent / "notebooks"


@pytest.mark.asyncio
@pytest.mark.parametrize("y_websocket_client", "2", indirect=True)
async def test_simple(y_websocket_server, y_websocket_client):
    ydoc = YDoc()
    ynotebook = YNotebook(ydoc)
    async with connect("ws://127.0.0.1:1234/room_2") as websocket, WebsocketProvider(ydoc, websocket):
        nb = stringify_source(json.loads((NOTEBOOKS_DIR / "simple.ipynb").read_text()))
        ynotebook.source = nb
        tester = YTester(ydoc, 3.0)
        await tester.clock_has_changed()
        assert tester.source == nb


@pytest.mark.asyncio
async def test_plotly(y_websocket_server):
    """This test checks in particular that the type cast is not breaking the data."""
    ydoc = YDoc()
    ynotebook = YNotebook(ydoc)
    nb = stringify_source(json.loads((NOTEBOOKS_DIR / "plotly.ipynb").read_text()))
    ynotebook.source = nb
    assert ynotebook.source == nb
