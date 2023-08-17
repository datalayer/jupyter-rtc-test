import asyncio

from y_py import YDoc
from jupyter_ydoc.utils import cast_all


class YTester:
    def __init__(self, ydoc: YDoc, timeout: float = 1.0):
        self.timeout = timeout
        self.ytest = ydoc.get_map("_test")
        with ydoc.begin_transaction() as t:
            self.ytest.set(t, "clock", 0)

    @property
    def source(self):
        return cast_all(self.ytest["source"], float, int)

    async def clock_has_changed(self):
        change = asyncio.Event()
        def callback(event):
            if "clock" in event.keys:
                change.set()
        self.ytest.observe(callback)
        return await asyncio.wait_for(change.wait(), timeout=self.timeout)
