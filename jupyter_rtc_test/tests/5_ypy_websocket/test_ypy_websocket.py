import asyncio
import json

import pytest
from websockets import connect

from y_py import YDoc
from ypy_websocket import WebsocketProvider


class Clocker:
    def __init__(self, ydoc: YDoc, timeout: float = 1.0):
        self.ydoc = ydoc
        self.timeout = timeout
        self.ytest = ydoc.get_map("_test")
        self.clock = -1.0

    def run_clock(self):
        self.clock = max(self.clock, 0.0)
        with self.ydoc.begin_transaction() as t:
            self.ytest.set(t, "clock", self.clock)

    async def clock_run(self):
        change = asyncio.Event()
        def callback(event):
            if "clock" in event.keys:
                clk = self.ytest["clock"]
                if clk > self.clock:
                    self.clock = clk + 1.0
                    change.set()
        subscription_id = self.ytest.observe(callback)
        await asyncio.wait_for(change.wait(), timeout=self.timeout)
        self.ytest.unobserve(subscription_id)


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "0", indirect=True)
async def test_y_py_websocket_0(y_ws_server, y_ws_client):
    ydoc = YDoc()
    ytest = Clocker(ydoc)
    websocket = await connect("ws://127.0.0.1:1234/my-roomname")
    WebsocketProvider(ydoc, websocket)
    ymap = ydoc.get_map("map")
    # set a value in "in"
    for v_in in range(10):
        with ydoc.begin_transaction() as t:
            ymap.set(t, "in", float(v_in))
        ytest.run_clock()
        await ytest.clock_run()
        v_out = ymap["out"]
        assert v_out == v_in + 1.0


@pytest.mark.asyncio
@pytest.mark.parametrize("y_ws_client", "1", indirect=True)
async def test_y_py_websocket_1(y_ws_server, y_ws_client):
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
    ytest = Clocker(ydoc)
    ytest.run_clock()
    await ytest.clock_run()
    ycells = ydoc.get_array("cells")
    ystate = ydoc.get_map("state")
    assert json.loads(ycells.to_json()) == [{"metadata": {"foo": "bar"}, "source": "1 + 2"}]
    assert json.loads(ystate.to_json()) == {"state": {"dirty": False}}
