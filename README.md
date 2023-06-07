[![Datalayer](https://assets.datalayer.design/datalayer-25.svg)](https://datalayer.io)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)

# Jupyter RTC Test

> 💦 Stress tests for 🪐 Jupyter 🔌 Real Time Collaboration (RTC)

The goal of this repository is to stress test the Real Time Collaboration (RTC) feature of JupyterLab and Jupyter Server.

The tests aims to replicate the real life case, menaing that most of them are running in a distrbuted way. You car run the test on a standalone (local laptop or CI) machine, in which case the distributed behavior is simulated. You can also run the test in a real a distributed environment like Kubernetes, this however requires you to setup additional infrastructure and configuration. Please note you can also run the Kubernetes flavored tests on a local Minikube instance.

## Why do we need this?

The dependencies for a functional RTC are spread in various repositories (at least 6). With this single repository, we strive to ensure that the full stack is covered. Is also ships tools to measure the quality and perfomance of the RTC system, think to `You can not scale what you can not measure...`

Historically, there have been a few RTC failures reported, with low volumes cases, we need to make sure the system is robust enough at scale, and also identify their limits.

- CRITICAL - data loss and notebook corruption on a hosted Lab instance https://github.com/jupyterlab/jupyterlab/issues/12154
- Non-empty notebooks appear as blank https://github.com/jupyterlab/jupyterlab/issues/13930
- Damaged notebook (duplicate cells) in RTC-active hosted hub https://github.com/jupyterlab/jupyterlab/issues/14031
- Development workflow with RTC https://github.com/jupyterlab/jupyterlab/issues/14170
- Collaboration mode rolls back progress https://github.com/jupyterlab/jupyterlab/issues/14224
- Collaboration rolls back progress https://github.com/jupyterlab/jupyterlab/issues/14278
- Collaboration breaks notebooks https://github.com/jupyterlab/jupyterlab/issues/14343
- Trusting notebook in RTC mode leads to File Changed dialog  https://github.com/jupyterlab/jupyterlab/issues/14347

## Develop

You need [Miniconda](https://docs.conda.io/en/latest/miniconda.html) up-and-running on your machine.

Clone the `jupyter-rtc-test` repository.

```bash
git clone https://github.com/datalayer/jupyter-rtc-test.git && \
  cd jupyter-rtc-test
```

If you already have created a conda environment, please remove it.

```bash
conda deactivate && \
  make env-rm
```

Create a new conda environment.

```bash
make env && \
  conda activate datalayer
```

**⚡ Watch out ⚡** The tests will not work with the `pytest-tornasync` or the `pytest-jupyter` plugins install. To avoid issues, run the following commands.

```bash
pip uninstall pytest-tornasync
pip uninstall pytest-jupyter
```

## Install and Build

Install the JavaScript dependencies.

```bash
yarn install
```

Build the JavaScript code.

```bash
yarn build
```

Install the Python package.

```bash
pip install -e .[test]
# Double check
pip list | grep rtc_test
# jupyter_rtc_test ...
```

Link the JupyterLab extension for development.

```bash
jupyter labextension develop . --overwrite
# Installing: .../jupyter_rtc_test/labextension -> @datalayer/jupyter-rtc_test
# Removing: .../labextensions/@datalayer/jupyter-rtc_test
# Symlinking: .../labextensions/@datalayer/jupyter-rtc_test -> .../jupyter_rtc_test/labextension
```

Check the availability of your Jupyter extension.

```bash
jupyter labextension list
# JupyterLab v4.0.0
# .../share/jupyter/labextensions
#        jupyterlab_pygments v0.2.2 enabled  X (python, jupyterlab_pygments)
#        @datalayer/jupyter-rtc_test v0.0.2 enabled  X
jupyter server extension list
# Package jupyter_rtc_test took 0.0015s to import
#      jupyter_rtc_test 0.0.. OK
```

## All Tests

Run the following command to run all the python or javascript tests on a local machine.

```bash
# Run the python tests.
yarn test:py
```

```bash
yarn test:js
```

**Note ♪** Kill any ghost process before running the tests.

```bash
yarn kill && \
  yarn test:py
```

The following subsections narrow down the tests, starting from the lower technical layers to the higher ones.

### 0. Y.js

The JavaScript shared data types for building collaborative software is developed in https://github.com/yjs/yjs

```bash
yarn test:py:0
```

### 1. Y Rust (Yrs)

The Rust port of Y.js is developed in https://github.com/y-crdt/y-crdt/tree/main/yrs.

```bash
yarn test:py:1
```

### 2. Y WebAssembly (Ywasm)

The JavaScript WASM shared data types are generated from `Yrs` and is developed in https://github.com/y-crdt/y-crdt/tree/main/ywasm

```bash
yarn test:py:2
```

### 3. Ypy

The Python binding for `Yrs` is developed in https://github.com/y-crdt/ypy.

```bash
yarn test:py:3
```

### 4. Ypy Store

The Store for `Ypy` is developed in https://github.com/y-crdt/ypy-websocket.

**Note ♪** Ypy Store should not be part of the `ypy_websocket` repository, see https://github.com/y-crdt/ypy-websocket/issues/19

```bash
yarn test:py:4
```

### 5. Ypy WebSocket

The WebSocket connector for `Ypy` is developed in https://github.com/y-crdt/ypy-websocket.

```bash
yarn test:py:5
```

### 6. Jupyter YDoc

Jupyter document structures for collaborative editing using `Y.js` JavaScript and `Ypy` Python developed in https://github.com/jupyter-server/jupyter_ydoc.

**Note ♪** `Y.js` should be replaced by `Ywasm`.

```bash
yarn test:py:6
```

### 7. Jupyter Collaboration

The JupyterLab extension that delivers the RTC functionality to the end-user is developed in https://github.com/jupyterlab/jupyter_collaboration.

```bash
yarn test:py:7
```

## User Interfaces

Upon running the RTC tests from the CLI, you can also run them from various user interfaces.

### Web Application

```bash
# open http://localhost:3063
yarn start
```

### Jupyter Server Application

```bash
# open http://localhost:8888/jupyter_rtc_test?token=142461e29e03250e569824cff00bc99941148a334ff258e5
yarn jupyter-rtc-test
```

### JupyterLab Extension

```bash
# open http://localhost:8686/api/jupyter/lab?token=60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6
yarn jupyterlab
```

## TODO

Simulate network latency with the help of TCP proxy.

- https://github.com/MarkNenadov/websocket_proxpy
- https://github.com/Shopify/toxiproxy
- https://github.com/douglas/toxiproxy-python

## ⚖️ License

Copyright (c) 2023 Datalayer, Inc.

Released under the terms of the BSD 3-Clause license (see [LICENSE](./LICENSE)).

This repository contains source code taken from the various repositories under `BSD-3` or `MIT` license. 
