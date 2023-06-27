import random
import json
import string
import sys
import rel

import websocket
from websocket import WebSocket

import asyncio

from websockets import connect  # type: ignore

from y_py import YDoc
from ypy_websocket import WebsocketProvider


id = int(sys.argv[1])
text_length = int(sys.argv[2])
warmup_period_seconds = int(sys.argv[3])

doc = YDoc()
text = doc.get_text('t')


MUTATE_DOC = True


info_ws_client = WebSocket()
info_ws_client.connect("ws://127.0.01:8888/jupyter_rtc_test/stresser")


def on_message(ws, message):
    print("-----------------", message)

info_ws_client_listener = websocket.WebSocketApp("ws://127.0.01:8888/jupyter_rtc_test/stresser", on_message=on_message)
info_ws_client_listener.run_forever(dispatcher=rel, reconnect=5)

async def main():
    websocket = await connect("ws://127.0.01:8888/jupyter_rtc_test/room/jupyter_rtc_test")
    websocket_provider = WebsocketProvider(doc, websocket)
    while True:
        if MUTATE_DOC:
            with doc.begin_transaction() as txn:
                length = len(str(text))
                if length < text_length:
                    random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
                    text.insert(txn, random.randint(0, length), random_string)
                else:
                    text.delete(txn, random.randint(0, int(length / 2)))
            print("Python client text", id, str(text))
            payload = json.dumps({
                "id": id,
                "action": "info",
                "text": str(text),
            })
            info_ws_client.send(payload)
        await asyncio.sleep(1)


if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
    loop.close()
