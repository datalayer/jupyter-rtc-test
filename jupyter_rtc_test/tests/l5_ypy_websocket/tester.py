import y_py as Y

from anyio import Event, create_task_group, move_on_after

class Tester:
    def __init__(self, ydoc: Y.YDoc, timeout: float = 1.0):
        self.ydoc = ydoc
        self.timeout = timeout
        self.ytest = ydoc.get_map("clocker")
        self.clock = -1.0

    def run_clock(self):
        self.clock = max(self.clock, 0.0)
        with self.ydoc.begin_transaction() as t:
            self.ytest.set(t, "clock", self.clock)

    async def clock_run(self):
        change = Event()

        def callback(event):
            if "clock" in event.keys:
                clk = self.ytest["clock"]
                if clk > self.clock:
                    self.clock = clk + 1.0
                    change.set()

        subscription_id = self.ytest.observe(callback)
        async with create_task_group():
            with move_on_after(self.timeout):
                await change.wait()

        self.ytest.unobserve(subscription_id)

