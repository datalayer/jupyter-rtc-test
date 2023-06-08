import json
import pytest

from pathlib import Path
from websockets import connect  # type: ignore

from y_py import YDoc
from ypy_websocket import WebsocketProvider
from jupyter_ydoc import YNotebook

from ..utils import stringify_source
from .utils import Tester


NOTEBOOKS_DIR = Path(__file__).parent / "notebooks"


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "2", indirect=True)
async def test_simple(y_ws_server, y_ws_client):
    doc = YDoc()
    notebook = YNotebook(doc)
    websocket = await connect("ws://127.0.0.1:1234/room_2")
    websocket_provider = WebsocketProvider(doc, websocket)
    nb = stringify_source(json.loads((NOTEBOOKS_DIR / "simple.ipynb").read_text()))
    notebook.source = nb
    tester = Tester(doc, 3.0)
    await tester.clock_has_changed()
    assert tester.source == nb


@pytest.mark.asyncio
async def test_plotly(y_ws_server):
    """This test checks in particular that the type cast is not breaking the data."""
    doc = YDoc()
    notebook = YNotebook(doc)
    nb = stringify_source(json.loads((NOTEBOOKS_DIR / "plotly.ipynb").read_text()))
    notebook.source = nb
    assert notebook.source == nb
