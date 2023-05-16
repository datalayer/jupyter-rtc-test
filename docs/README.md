[![Datalayer](https://assets.datalayer.design/datalayer-25.svg)](https://datalayer.io)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)

# Jupyter RTC Test

This is a collection of notes useful for the development.

## Jupyter YDoc Flaky Test

The `jupyter_ydoc` test on my Macbook are flaky.

````
========================================================================== 1 failed, 1 passed in 0.61s ==========================================================================
 datalayer  echarles  datalayer  ~  …  jupyter-ydoc   main  $    python -m pytest -v
============================================================================== test session starts ==============================================================================
platform darwin -- Python 3.10.0, pytest-7.2.2, pluggy-1.0.0 -- /Users/echarles/miniconda3/envs/datalayer/bin/python
cachedir: .pytest_cache
rootdir: /Users/echarles/private/datalayer-dev/ext/jupyter-ydoc, configfile: pytest.ini
plugins: asyncio-0.21.0, tornasync-0.6.0.post2, timeout-2.1.0, pytest_check_links-0.8.0, cov-4.0.0, console-scripts-1.3.1, anyio-3.6.2
asyncio: mode=auto
collected 2 items                                                                                                                                                               

tests/test_ypy_yjs.py::test_ypy_yjs_0[0] FAILED                                                                                                                           [ 50%]
tests/test_ypy_yjs.py::test_plotly_renderer PASSED                                                                                                                        [100%]

=================================================================================== FAILURES ====================================================================================
_______________________________________________________________________________ test_ypy_yjs_0[0] _______________________________________________________________________________

yws_server = <ypy_websocket.websocket_server.WebsocketServer object at 0x10d408130>
yjs_client = <Popen: returncode: None args: ['yarn', 'node', '/Users/echarles/private/dat...>

    @pytest.mark.asyncio
    @pytest.mark.parametrize("yjs_client", "0", indirect=True)
    async def test_ypy_yjs_0(yws_server, yjs_client):
        ydoc = Y.YDoc()
        ynotebook = YNotebook(ydoc)
        websocket = await connect("ws://localhost:1234/my-roomname")
        WebsocketProvider(ydoc, websocket)
        nb = stringify_source(json.loads((files_dir / "nb0.ipynb").read_text()))
        ynotebook.source = nb
        ytest = YTest(ydoc, 3.0)
        await ytest.change()
>       assert ytest.source == nb
E       AssertionError: assert {'cells': [{'...mat_minor': 5} == {'cells': [{'...mat_minor': 5}
E         Omitting 3 identical items, use -vv to show
E         Differing items:
E         {'cells': [{'cell_type': 'code', 'execution_count': None, 'id': None, 'metadata': {}, ...}, {'cell_type': 'code', 'exe...id': None, 'metadata': {}, ...}, {'cell_type': 'code', 'execution_count': None, 'id': None, 'metadata': {}, ...}, ...]} != {'cells': [{'cell_type': 'code', 'execution_count': None, 'id': None, 'metadata': {}, ...}, {'cell_type': 'code', 'execution_count': None, 'id': None, 'metadata': {}, ...}]}
E         Full diff:
E           {
E            'cells': [{'cell_type': 'code',
E         +             'execution_count': None,...
E         
E         ...Full output truncated (325 lines hidden), use '-vv' to show

tests/test_ypy_yjs.py:62: AssertionError
----------------------------------------------------------------------------- Captured log teardown -----------------------------------------------------------------------------
ERROR    asyncio:base_events.py:1729 Task exception was never retrieved
future: <Task finished name='Task-95' coro=<WebSocketCommonProtocol.send() done, defined at /Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py:580> exception=ConnectionClosedOK(Close(code=1001, reason=''), Close(code=1001, reason=''), False)>
Traceback (most recent call last):
  File "/Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py", line 635, in send
    await self.ensure_open()
  File "/Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py", line 953, in ensure_open
    raise self.connection_closed_exc()
websockets.exceptions.ConnectionClosedOK: sent 1001 (going away); then received 1001 (going away)
ERROR    asyncio:base_events.py:1729 Task exception was never retrieved
future: <Task finished name='Task-99' coro=<WebSocketCommonProtocol.send() done, defined at /Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py:580> exception=ConnectionClosedOK(Close(code=1001, reason=''), Close(code=1001, reason=''), False)>
Traceback (most recent call last):
  File "/Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py", line 635, in send
    await self.ensure_open()
  File "/Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py", line 953, in ensure_open
    raise self.connection_closed_exc()

...

websockets.exceptions.ConnectionClosedOK: sent 1001 (going away); then received 1001 (going away)
ERROR    asyncio:base_events.py:1729 Task exception was never retrieved
future: <Task finished name='Task-120' coro=<WebSocketCommonProtocol.send() done, defined at /Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py:580> exception=ConnectionClosedOK(Close(code=1001, reason=''), Close(code=1001, reason=''), False)>
Traceback (most recent call last):
  File "/Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py", line 635, in send
    await self.ensure_open()
  File "/Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py", line 953, in ensure_open
    raise self.connection_closed_exc()
websockets.exceptions.ConnectionClosedOK: sent 1001 (going away); then received 1001 (going away)
============================================================================ short test summary info ============================================================================
FAILED tests/test_ypy_yjs.py::test_ypy_yjs_0[0] - AssertionError: assert {'cells': [{'...mat_minor': 5} == {'cells': [{'...mat_minor': 5}
========================================================================== 1 failed, 1 passed in 0.80s ==========================================================================
Task exception was never retrieved
future: <Task finished name='Task-107' coro=<WebSocketCommonProtocol.send() done, defined at /Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py:580> exception=ConnectionClosedOK(Close(code=1001, reason=''), Close(code=1001, reason=''), False)>
Traceback (most recent call last):
  File "/Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py", line 635, in send
    await self.ensure_open()
  File "/Users/echarles/miniconda3/envs/datalayer/lib/python3.10/site-packages/websockets/legacy/protocol.py", line 953, in ensure_open
    raise self.connection_closed_exc()
websockets.exceptions.ConnectionClosedOK: sent 1001 (going away); then received 1001 (going away)
 datalayer  echarles  datalayer  ~  …  jupyter-ydoc   main  $    python -m pytest -v
============================================================================== test session starts ==============================================================================
platform darwin -- Python 3.10.0, pytest-7.2.2, pluggy-1.0.0 -- /Users/echarles/miniconda3/envs/datalayer/bin/python
cachedir: .pytest_cache
rootdir: /Users/echarles/private/datalayer-dev/ext/jupyter-ydoc, configfile: pytest.ini
plugins: asyncio-0.21.0, tornasync-0.6.0.post2, timeout-2.1.0, pytest_check_links-0.8.0, cov-4.0.0, console-scripts-1.3.1, anyio-3.6.2
asyncio: mode=auto
collected 2 items                                                                                                                                                               

tests/test_ypy_yjs.py::test_ypy_yjs_0[0] FAILED                                                                                                                           [ 50%]
tests/test_ypy_yjs.py::test_plotly_renderer PASSED                                                                                                                        [100%]

=================================================================================== FAILURES ====================================================================================
_______________________________________________________________________________ test_ypy_yjs_0[0] _______________________________________________________________________________

yws_server = <ypy_websocket.websocket_server.WebsocketServer object at 0x1118028c0>
yjs_client = <Popen: returncode: None args: ['yarn', 'node', '/Users/echarles/private/dat...>

    @pytest.mark.asyncio
    @pytest.mark.parametrize("yjs_client", "0", indirect=True)
    async def test_ypy_yjs_0(yws_server, yjs_client):
        ydoc = Y.YDoc()
        ynotebook = YNotebook(ydoc)
        websocket = await connect("ws://localhost:1234/my-roomname")
        WebsocketProvider(ydoc, websocket)
        nb = stringify_source(json.loads((files_dir / "nb0.ipynb").read_text()))
        ynotebook.source = nb
        ytest = YTest(ydoc, 3.0)
        await ytest.change()
>       assert ytest.source == nb
E       AssertionError: assert {'cells': [{'...mat_minor': 5} == {'cells': [{'...mat_minor': 5}
E         Omitting 3 identical items, use -vv to show
E         Differing items:
E         {'cells': [{'cell_type': 'code', 'execution_count': None, 'id': None, 'metadata': {}, ...}, {'cell_type': 'code', 'exe...id': None, 'metadata': {}, ...}, {'cell_type': 'code', 'execution_count': None, 'id': None, 'metadata': {}, ...}, ...]} != {'cells': [{'cell_type': 'code', 'execution_count': None, 'id': None, 'metadata': {}, ...}, {'cell_type': 'code', 'execution_count': None, 'id': None, 'metadata': {}, ...}]}
E         Full diff:
E           {
E            'cells': [{'cell_type': 'code',
E         +             'execution_count': None,...
E         
E         ...Full output truncated (325 lines hidden), use '-vv' to show

tests/test_ypy_yjs.py:62: AssertionError
============================================================================ short test summary info ============================================================================
FAILED tests/test_ypy_yjs.py::test_ypy_yjs_0[0] - AssertionError: assert {'cells': [{'...mat_minor': 5} == {'cells': [{'...mat_minor': 5}
========================================================================== 1 failed, 1 passed in 0.24s ==========================================================================
 datalayer  echarles  datalayer  ~  …  jupyter-ydoc   main  $    python -m pytest -v
============================================================================== test session starts ==============================================================================
platform darwin -- Python 3.10.0, pytest-7.2.2, pluggy-1.0.0 -- /Users/echarles/miniconda3/envs/datalayer/bin/python
cachedir: .pytest_cache
rootdir: /Users/echarles/private/datalayer-dev/ext/jupyter-ydoc, configfile: pytest.ini
plugins: asyncio-0.21.0, tornasync-0.6.0.post2, timeout-2.1.0, pytest_check_links-0.8.0, cov-4.0.0, console-scripts-1.3.1, anyio-3.6.2
asyncio: mode=auto
collected 2 items                                                                                                                                                               

tests/test_ypy_yjs.py::test_ypy_yjs_0[0] PASSED                                                                                                                           [ 50%]
tests/test_ypy_yjs.py::test_plotly_renderer PASSED         
````
