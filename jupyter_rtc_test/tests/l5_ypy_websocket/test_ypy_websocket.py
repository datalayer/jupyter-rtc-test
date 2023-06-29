import json

import pytest

from anyio import sleep

from websockets import connect  # type: ignore

from y_py import YDoc
from ypy_websocket import WebsocketProvider

from .tester import Tester


@pytest.mark.anyio
@pytest.mark.parametrize("y_websocket_client", "0", indirect=True)
async def test_ypy_yjs_0(y_websocket_server, y_websocket_client):
    ydoc = YDoc()
    ytest = Tester(ydoc)
    async with connect("ws://127.0.0.1:1234/room-0") as websocket, WebsocketProvider(
        ydoc, websocket
    ):
        ymap = ydoc.get_map("map")
        # set a value in "in"
        for v_in in range(10):
            with ydoc.begin_transaction() as t:
                ymap.set(t, "in", float(v_in))
            ytest.run_clock()
            await ytest.clock_run()
            v_out = ymap["out"]
            assert v_out == v_in + 1.0


@pytest.mark.anyio
@pytest.mark.parametrize("y_websocket_client", "1", indirect=True)
async def test_ypy_yjs_1(y_websocket_server, y_websocket_client):
    # wait for the JS client to connect
    tt, dt = 0, 0.1
    while True:
        await sleep(dt)
        if "/room-1" in y_websocket_server.rooms:
            break
        tt += dt
        if tt >= 1:
            raise RuntimeError("Timeout waiting for client to connect")
    ydoc = y_websocket_server.rooms["/room-1"].ydoc
    ytest = Tester(ydoc)
    ytest.run_clock()
    await ytest.clock_run()
    ycells = ydoc.get_array("cells")
    ystate = ydoc.get_map("state")
    assert json.loads(ycells.to_json()) == [{"metadata": {"foo": "bar"}, "source": "1 + 2"}]
    assert json.loads(ystate.to_json()) == {"state": {"dirty": False}}
