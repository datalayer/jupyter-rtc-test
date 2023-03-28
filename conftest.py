import subprocess
import pytest

from pathlib import Path
from websockets import serve

import y_py as Y
from ypy_websocket import WebsocketServer


pytest_plugins = ("jupyter_server.pytest_plugin", )


here = Path(__file__).parent


@pytest.fixture
def jp_server_config(jp_server_config):
    return {"ServerApp": {"jpserver_extensions": {"jupyter_rtc_test": True}}}


@pytest.fixture
async def yws_server(request):
    try:
        kwargs = request.param
    except Exception:
        kwargs = {}
    websocket_server = WebsocketServer(**kwargs)
    async with serve(websocket_server.serve, "localhost", 1234):
        yield websocket_server


@pytest.fixture
def yjs_client(request):
    client_id = request.param
    p = subprocess.Popen(
        [
            "node",
#            "--experimental-specifier-resolution=node",
            f"{here / './../../src/yjs/__tests__/clients/yclient_'}{client_id}.mjs",
        ]
    )
    yield p
    p.kill()


class TestYDoc:
    def __init__(self):
        self.ydoc = Y.YDoc()
        self.array = self.ydoc.get_array("array")
        self.state = None
        self.value = 0

    def update(self):
        with self.ydoc.begin_transaction() as txn:
            self.array.append(txn, self.value)
        self.value += 1
        update = Y.encode_state_as_update(self.ydoc, self.state)
        self.state = Y.encode_state_vector(self.ydoc)
        return update


@pytest.fixture
def test_ydoc():
    return TestYDoc()
