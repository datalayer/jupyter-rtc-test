[![Datalayer](https://assets.datalayer.design/datalayer-25.svg)](https://datalayer.io)

# Jupyter RTC Test

WIP The goal of this repository is to run unit, integration and stress tests for the Realtime Collaboration (RTC) feature of Jupyter (Lab and Server).

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

This repository contains souce code taken from the following repositories under BSD-3 or MIT license.

- https://github.com/jupyterlab/jupyter_collaboration
- https://github.com/jupyter-server/jupyter_ydoc
- https://github.com/y-crdt/ypy-websocket
- https://github.com/y-crdt/ypy
- https://github.com/y-crdt/y-crdt
