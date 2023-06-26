import sys

import asyncio

from websockets import connect  # type: ignore

from y_py import YDoc
from ypy_websocket import WebsocketProvider


id = sys.argv[1]
doc = YDoc()


async def do_run():
    websocket = await connect("ws://127.0.01:8888/jupyter_rtc_test/room/jupyter_rtc_test")
    websocket_provider = WebsocketProvider(doc, websocket)
    text = doc.get_text('t')
    while True:
      with doc.begin_transaction() as txn:
          text.insert(txn, 0, '|')        
      print(text)
      await asyncio.sleep(10)


loop = asyncio.get_event_loop()
tasks = [
    loop.create_task(do_run()),
]
loop.run_until_complete(asyncio.wait(tasks))
loop.close()
