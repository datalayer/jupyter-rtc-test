import asyncio
import json

import pytest
from websockets import connect

from y_py import YDoc
from ypy_websocket import WebsocketProvider

from jupyter_rtc_test.tests.r5_ypy_websocket.utils import Tester


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "0", indirect=True)
async def test_ypy_websocket_0(y_ws_server, y_ws_client):
    ydoc = YDoc()
    ytest = Tester(ydoc)
    websocket = await connect("ws://127.0.0.1:1234/my-roomname")
    WebsocketProvider(ydoc, websocket)
    ymap = ydoc.get_map("map")
    # set a value in "in"
    for v_in in range(10):
        with ydoc.begin_transaction() as t:
            ymap.set(t, "in", float(v_in))
        ytest.run_clock()
        await ytest.clock_has_run()
        v_out = ymap["out"]
        assert v_out == v_in + 1.0


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "1", indirect=True)
async def test_ypy_websocket_1(y_ws_server, y_ws_client):
    # Wait for the JS client to connect.
    tt, dt = 0, 0.1
    while True:
        await asyncio.sleep(dt)
        if "/my-roomname" in y_ws_server.rooms:
            break
        tt += dt
        if tt >= 1:
            raise RuntimeError("Timeout waiting for client to connect")
    ydoc = y_ws_server.rooms["/my-roomname"].ydoc
    tester = Tester(ydoc)
    tester.run_clock()
    await tester.clock_has_run()
    ycells = ydoc.get_array("cells")
    ystate = ydoc.get_map("state")
    assert json.loads(ycells.to_json()) == [{"metadata": {"foo": "bar"}, "source": "1 + 2"}]
    assert json.loads(ystate.to_json()) == {"state": {"dirty": False}}
