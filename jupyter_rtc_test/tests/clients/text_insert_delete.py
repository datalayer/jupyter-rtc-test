import random
import json
import string
import sys

import asyncio

from datetime import datetime
from threading import Thread

import websocket
from websocket import WebSocket
from websockets import connect  # type: ignore

from y_py import YDoc
from ypy_websocket import WebsocketProvider


WAIT_S = 5


client_id = int(sys.argv[1])
text_length = int(sys.argv[2])
warmup_period_seconds = int(sys.argv[3])
room_name = sys.argv[4]

doc = YDoc()
text = doc.get_text('t')


global MUTATE_DOC
MUTATE_DOC = True


info_ws_client = WebSocket()
info_ws_client.connect("ws://127.0.01:8888/jupyter_rtc_test/stresser")


def on_message(ws, m):
    global MUTATE_DOC 
    message = json.loads(m)
    action = message['action']
    if action == 'pause':
        MUTATE_DOC = False
    if action == 'restart':
        MUTATE_DOC = True

def listen_ws_info():
    info_ws_client_listener = websocket.WebSocketApp("ws://127.0.01:8888/jupyter_rtc_test/stresser", on_message=on_message)
    info_ws_client_listener.run_forever()

thread = Thread(target=listen_ws_info)
thread.start()


async def main():

    global MUTATE_DOC 

#    websocket = await connect(f"ws://127.0.01:8888/jupyter_rtc_test/room/{room_name}")
#    websocket_provider = WebsocketProvider(doc, websocket)
    async with connect(f"ws://127.0.01:8888/jupyter_rtc_test/room/{room_name}") as websocket, WebsocketProvider(
        doc, websocket
    ):

        def callback(e):
            curr_dt = datetime.now()
            payload = json.dumps({
                "clientId": client_id,
                "clientType": "python",
                "mutating": MUTATE_DOC,
                "action": "info",
                "document": str(text),
                "timestamp": int(round(curr_dt.timestamp())),
                "room": room_name
            })
            info_ws_client.send(payload)

        obs = text.observe(callback)

        while True:
            if MUTATE_DOC:
                with doc.begin_transaction() as txn:
                    length = len(str(text))
                    if length < text_length:
                        random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
                        text.insert(txn, random.randint(0, length), random_string)
                    else:
                        text.delete(txn, random.randint(0, int(length / 2)))
    #            print("Python client text", client_id, str(text))
            await asyncio.sleep(WAIT_S)


if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
    loop.close()
