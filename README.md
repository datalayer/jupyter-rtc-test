[![Datalayer](https://assets.datalayer.design/datalayer-25.svg)](https://datalayer.io)

# Jupyter RTC Test

The goal of this repository is to stress test the Realtime Collaboration (RTC) feature of Jupyter (Lab and Server).

```bash
yarn install
yarn test
yarn test:py
```

You can also run the tests from a JupyterLab extension.

```bash
pip install -e .[test]
jupyter labextension develop . --overwrite
jupyter labextension list
jupyter server extension list
yarn jupyterlab
```

This repository contains source code taken from the following repositories under `BSD-3` or `MIT` license.

- https://github.com/jupyterlab/jupyter_collaboration, the JupyterLab extensions that delivers the RTC functionality to the end users.
- https://github.com/jupyter-server/jupyter_ydoc, Jupyter document structures for collaborative editing using `Y.js` JavaScript and `ypy` Python.
- https://github.com/y-crdt/ypy-websocket, WebSocket connector for `ypy`.
- https://github.com/y-crdt/ypy, Python bindings to `y-crdt`.
- https://github.com/y-crdt/y-crdt, Rust port of Y.js with WASM javascript artificats.
- https://github.com/yjs/yjs, JavaScript shared data types for building collaborative software.

More information about the details of the implementatoin can be read on [this document](https://github.com/datalayer/jupyter-rtc-test/blob/main/docs/README.md).
