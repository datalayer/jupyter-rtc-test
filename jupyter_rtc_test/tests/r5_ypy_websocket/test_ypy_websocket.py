import asyncio
import json

import pytest
from websockets import connect

from y_py import YDoc
from ypy_websocket import WebsocketProvider

from .utils import Tester


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "0", indirect=True)
async def test_ypy_websocket_0(y_ws_server, y_ws_client):
    doc = YDoc()
    tester = Tester(doc)
    websocket = await connect("ws://127.0.0.1:1234/room_0")
    websocket_provider = WebsocketProvider(doc, websocket)
    map = doc.get_map("map")
    # set a value in "in"
    for v_in in range(10):
        with doc.begin_transaction() as t:
            map.set(t, "in", float(v_in))
        tester.run_clock()
        await tester.clock_has_run()
        v_out = map["out"]
        assert v_out == v_in + 1.0


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "1", indirect=True)
async def test_ypy_websocket_1(y_ws_server, y_ws_client):
    # Wait for the JS client to connect.
    tt, dt = 0, 0.1
    while True:
        await asyncio.sleep(dt)
        if "/room_1" in y_ws_server.rooms:
            break
        tt += dt
        if tt >= 1:
            raise RuntimeError("Timeout waiting for client to connect")
    doc = y_ws_server.rooms["/room_1"].ydoc
    tester = Tester(doc)
    tester.run_clock()
    await tester.clock_has_run()
    cells = doc.get_array("cells")
    state = doc.get_map("state")
    assert json.loads(cells.to_json()) == [{"metadata": {"foo": "bar"}, "source": "1 + 2"}]
    assert json.loads(state.to_json()) == {"state": {"dirty": False}}
