import json
import pytest

from pathlib import Path
from websockets import connect  # type: ignore

from y_py import YDoc
from ypy_websocket import WebsocketProvider

from jupyter_ydoc import YNotebook

from ..utils import stringify_source
from .utils import Tester


notebooks_dir = Path(__file__).parent / "notebooks"


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "2", indirect=True)
async def test_simple(y_ws_server, y_ws_client):
    doc = YDoc()
    notebook = YNotebook(doc)
    websocket = await connect("ws://127.0.0.1:1234/room-1")
    websocket_provider = WebsocketProvider(doc, websocket)
    nb = stringify_source(json.loads((notebooks_dir / "simple.ipynb").read_text()))
    notebook.source = nb
    tester = Tester(doc, 3.0)
    await tester.clock_has_changed()
    assert tester.source == nb


@pytest.mark.asyncio
async def test_plotly(y_ws_server):
    """This test checks in particular that the type cast is not breaking the data."""
    ydoc = YDoc()
    ynotebook = YNotebook(ydoc)
    nb = stringify_source(json.loads((notebooks_dir / "plotly.ipynb").read_text()))
    ynotebook.source = nb
    assert ynotebook.source == nb
