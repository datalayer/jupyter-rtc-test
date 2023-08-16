# Architecture

<div align="center" style="text-align: center">
  <img alt="Jupyter RTC Stack" src="https://raw.githubusercontent.com/datalayer/jupyter-rtc-test/main/style/svg/jupyter-rtc-stack.image.svg" />
</div>

## 0. Yjs

`Yjs` delivers the JavaScript shared data types for building collaborative software and is developed in https://github.com/yjs/yjs

**♪ Note** `Yjs` should be replaced by `Ywasm`.

## 1. Y Rust - Yrs

`Yrs` delivers the Rust port of Y.js and is developed in https://github.com/y-crdt/y-crdt/tree/main/yrs.

## 2. Y WebAssembly - Ywasm

`Ywasm` delivers the JavaScript WASM shared data types are generated from `Yrs` and is developed in https://github.com/y-crdt/y-crdt/tree/main/ywasm

## 3. Ypy

`Ypy` delivers the Python binding for `Yrs` and is developed in https://github.com/y-crdt/ypy.

## 4. Ypy Store

The `Store` for `Ypy` is developed in https://github.com/y-crdt/ypy-websocket.

**♪ Note** Ypy Store should not be part of the `ypy_websocket` repository, see [this issue](https://github.com/y-crdt/ypy-websocket/issues/19).

## 5. Ypy WebSocket

The WebSocket connector for `Ypy` is developed in https://github.com/y-crdt/ypy-websocket.

## 6. Jupyter YDoc

`Jupyter YDoc` delivers the document structures for Jupyter collaborative editing using `Y.js` and `Ypy` and is developed in https://github.com/jupyter-server/jupyter_ydoc.

## 7. Jupyter Collaboration

The `JupyterLab Collaboration` extension that delivers the RTC functionality to the end-user is developed in https://github.com/jupyterlab/jupyter_collaboration.
