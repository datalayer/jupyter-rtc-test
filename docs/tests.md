# Tests

Run the following commans to launch all the Python or JavaScript tests on a local machine.

```bash
# Run the python tests.
yarn test:py
```

```bash
# Run the javascript tests.
yarn test:js
```

**♪ Note** Kill any ghost process before running the tests.

```bash
yarn kill && \
  yarn test:py
```

The following subsections narrow down the tests, starting from the lower technical layers to the higher ones.

## 0. Yjs

`Yjs` delivers the JavaScript shared data types for building collaborative software and is developed in https://github.com/yjs/yjs

```bash
yarn test:js:0
yarn test:py:0
```

**♪ Note** `Yjs` should be replaced by `Ywasm`.

## 1. Y Rust - Yrs

`Yrs` delivers the Rust port of Y.js and is developed in https://github.com/y-crdt/y-crdt/tree/main/yrs.

```bash
yarn test:js:1
yarn test:py:1
```

## 2. Y WebAssembly - Ywasm

`Ywasm` delivers the JavaScript WASM shared data types are generated from `Yrs` and is developed in https://github.com/y-crdt/y-crdt/tree/main/ywasm

```bash
yarn test:js:2
yarn test:py:2
```

## 3. Ypy

`Ypy` delivers the Python binding for `Yrs` and is developed in https://github.com/y-crdt/ypy.

```bash
yarn test:js:3
yarn test:py:3
```

## 4. Ypy Store

The `Store` for `Ypy` is developed in https://github.com/y-crdt/ypy-websocket.

**♪ Note** Ypy Store should not be part of the `ypy_websocket` repository, see [this issue](https://github.com/y-crdt/ypy-websocket/issues/19).

```bash
yarn test:js:4
yarn test:py:4
```

## 5. Ypy WebSocket

The WebSocket connector for `Ypy` is developed in https://github.com/y-crdt/ypy-websocket.

```bash
yarn test:js:5
yarn test:py:5
```

## 6. Jupyter YDoc

`Jupyter YDoc` delivers the document structures for Jupyter collaborative editing using `Y.js` and `Ypy` and is developed in https://github.com/jupyter-server/jupyter_ydoc.

```bash
yarn test:js:6
yarn test:py:6
```

## 7. Jupyter Collaboration

The JupyterLab extension that delivers the RTC functionality to the end-user is developed in https://github.com/jupyterlab/jupyter_collaboration.

```bash
yarn test:js:7
yarn test:py:7
```
