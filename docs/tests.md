# Tests

Run the following command to run all the python or javascript tests on a local machine.

```bash
# Run the python tests.
yarn test:py
```

```bash
# Run the javascript tests.
yarn test:js
```

**Note ♪** Kill any ghost process before running the tests.

```bash
yarn kill && \
  yarn test:py
```

The following subsections narrow down the tests, starting from the lower technical layers to the higher ones.

## 0. Y.js

The JavaScript shared data types for building collaborative software is developed in https://github.com/yjs/yjs

```bash
yarn test:py:0
```

## 1. Y Rust - Yrs

The Rust port of Y.js is developed in https://github.com/y-crdt/y-crdt/tree/main/yrs.

```bash
yarn test:py:1
```

## 2. Y WebAssembly - Ywasm

The JavaScript WASM shared data types are generated from `Yrs` and is developed in https://github.com/y-crdt/y-crdt/tree/main/ywasm

```bash
yarn test:py:2
```

## 3. Ypy

The Python binding for `Yrs` is developed in https://github.com/y-crdt/ypy.

```bash
yarn test:py:3
```

## 4. Ypy Store

The Store for `Ypy` is developed in https://github.com/y-crdt/ypy-websocket.

**Note ♪** Ypy Store should not be part of the `ypy_websocket` repository, see https://github.com/y-crdt/ypy-websocket/issues/19

```bash
yarn test:py:4
```

## 5. Ypy WebSocket

The WebSocket connector for `Ypy` is developed in https://github.com/y-crdt/ypy-websocket.

```bash
yarn test:py:5
```

## 6. Jupyter YDoc

Jupyter document structures for collaborative editing using `Y.js` JavaScript and `Ypy` Python developed in https://github.com/jupyter-server/jupyter_ydoc.

**Note ♪** `Y.js` should be replaced by `Ywasm`.

```bash
yarn test:py:6
```

## 7. Jupyter Collaboration

The JupyterLab extension that delivers the RTC functionality to the end-user is developed in https://github.com/jupyterlab/jupyter_collaboration.

```bash
yarn test:py:7
```
