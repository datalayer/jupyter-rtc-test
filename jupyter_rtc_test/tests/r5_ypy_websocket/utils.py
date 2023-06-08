import asyncio

from y_py import YDoc


class Tester:
    def __init__(self, ydoc: YDoc, timeout: float = 1.0):
        self.ydoc = ydoc
        self.timeout = timeout
        self.ytest = ydoc.get_map("_test")
        self.clock = -1.0

    def run_clock(self):
        self.clock = max(self.clock, 0.0)
        with self.ydoc.begin_transaction() as t:
            self.ytest.set(t, "clock", self.clock)

    async def clock_has_run(self):
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
