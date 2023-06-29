import json
import subprocess

import pytest

from pathlib import Path
from websockets import serve  # type: ignore

from y_py import encode_state_as_update, encode_state_vector, YDoc

from ypy_websocket import WebsocketServer


HERE = Path(__file__).parent


def update_json_file(path: Path, d: dict):
    try:
        with open(path, "rb") as f:
            package_json = json.load(f)
        package_json.update(d)
        with open(path, "w") as f:
            json.dump(package_json, f, indent=2)
    except:
        pass

# Workaround until https://github.com/yjs/y-websocket/pull/104 is merged and released.
HERE = Path(__file__).parent
d = {"type": "module"}
update_json_file(HERE / "node_modules/y-websocket/package.json", d)
# update_json_file(HERE / "node_modules/@jupyterlab/nbformat/package.json", d)


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
async def y_websocket_server(request):
    try:
        kwargs = request.param
    except Exception:
        kwargs = {}
    websocket_server = WebsocketServer(**kwargs)
    try:
        async with websocket_server, serve(websocket_server.serve, "127.0.0.1", 1234):
            yield websocket_server
    except Exception:
        pass


@pytest.fixture
def y_websocket_client(request):
    client_id = request.param
    p = subprocess.Popen(["node", f"{HERE / 'src/__tests__/clients/client-'}{client_id}.mjs"])
    yield p
    p.kill()


@pytest.fixture
def test_ydoc():
    return TestYDoc()


@pytest.fixture
def anyio_backend():
    return "asyncio"
