import json
import sys

import asyncio

from datetime import datetime
from threading import Thread

import websocket
from websocket import WebSocket
from websockets import connect  # type: ignore

from ypy_websocket import WebsocketProvider
from jupyter_ydoc import YNotebook


WAIT_S = 5


client_id = int(sys.argv[1])
text_length = int(sys.argv[2])
warmup_period_seconds = int(sys.argv[3])
room_name = sys.argv[4]

notebook = YNotebook()


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

    websocket = await connect(f"ws://127.0.01:8888/jupyter_rtc_test/room/{room_name}")
    websocket_provider = WebsocketProvider(notebook.ydoc, websocket)

    def callback(e):
        curr_dt = datetime.now()
        payload = json.dumps({
            "clientId": client_id,
            "clientType": "python",
            "mutating": MUTATE_DOC,
            "action": "info",
            "document": json.dumps(notebook.source),
            "timestamp": int(round(curr_dt.timestamp())),
        })
        info_ws_client.send(payload)

    notebook.observe(callback)

    while True:
        if MUTATE_DOC:
            with notebook.ydoc.begin_transaction() as txn:
                if notebook.cell_number == 0:
                    notebook.append_cell({
                        'id': '',
                        'cell_type': 'code',
                        'meta': {
                            'nbformat': 4,
                            'nbformat_minor': 4,
                            'jupyter': {
                                'rtc_test': True,
                            }
                        },
                        'metadata': {
                        'nbformat': 4,
                        'nbformat_minor': 4,
                            'jupyter': {
                                'rtc_test': True,
                            }
                        },
                        'source': 'x=1',
                        'outputs': [],
                        'execution_count': 0,
                    }, txn)
                if notebook.cell_number == 1:
                    notebook.get_cell(0)["source"] = "x=1"
        await asyncio.sleep(WAIT_S)


if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
    loop.close()
