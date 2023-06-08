import json
import subprocess

import pytest
import pytest_asyncio

from pathlib import Path
from websockets import serve

from y_py import encode_state_as_update, encode_state_vector, YDoc
from ypy_websocket import WebsocketServer


pytest_plugins = [
#    "jupyter_server.pytest_plugin",
#    "jupyter_rtc_test.tests.jupyter_server_fixtures",
]

HERE = Path(__file__).parent


def update_json_file(path: Path, d: dict):
    with open(path, "rb") as f:
        package_json = json.load(f)
    package_json.update(d)
    with open(path, "w") as f:
        json.dump(package_json, f, indent=2)

# Workaround until https://github.com/yjs/y-websocket/pull/104 is merged and released.
HERE = Path(__file__).parent
d = {"type": "module"}
update_json_file(HERE / "node_modules/y-websocket/package.json", d)
# update_json_file(HERE / "node_modules/@jupyterlab/nbformat/package.json", d)


@pytest.fixture
def jp_server_config(jp_server_config):
    return {"ServerApp": {"jpserver_extensions": {"jupyter_rtc_test": True}}}


class TestYDoc:
    def __init__(self):
        self.ydoc = YDoc()
        self.array = self.ydoc.get_array("array")
        self.state = None
        self.value = 0

    def update(self):
        with self.ydoc.begin_transaction() as txn:
            self.array.append(txn, self.value)
        self.value += 1
        update = encode_state_as_update(self.ydoc, self.state)
        self.state = encode_state_vector(self.ydoc)
        return update


@pytest.fixture
def test_ydoc():
    return TestYDoc()


@pytest_asyncio.fixture
async def y_websocket_client(request):
    client_id = request.param
    p = subprocess.Popen(["node", f"{HERE / 'src/__tests__/clients/y_websocket_client_'}{client_id}.mjs"])
    yield p
    p.kill()


@pytest_asyncio.fixture
async def y_websocket_server(request):
    try:
        kwargs = request.param
    except Exception:
        kwargs = {}
    websocket_server = WebsocketServer(**kwargs)
    async with serve(websocket_server.serve, "127.0.0.1", 1234):
        yield websocket_server
