import asyncio

from y_py import YDoc


class Tester:
    def __init__(self, doc: YDoc, timeout: float = 1.0):
        self.doc = doc
        self.timeout = timeout
        self.clocker = doc.get_map("clocker")
        self.clock = -1.0

    def run_clock(self):
        self.clock = max(self.clock, 0.0)
        with self.doc.begin_transaction() as t:
            self.clocker.set(t, "clock", self.clock)

    async def clock_has_run(self):
        change = asyncio.Event()
        def callback(event):
            if "clock" in event.keys:
                clk = self.clocker["clock"]
                if clk > self.clock:
                    self.clock = clk + 1.0
                    change.set()
        subscription_id = self.clocker.observe(callback)
        await asyncio.wait_for(change.wait(), timeout=self.timeout)
        self.clocker.unobserve(subscription_id)
