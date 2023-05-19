[![Datalayer](https://assets.datalayer.design/datalayer-25.svg)](https://datalayer.io)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)

# Jupyter RTC Test

> 💦 Stress tests for 🪐 Jupyter 🔌 Real Time Collaboration (RTC)

The goal of this repository is to stress test the Real Time Collaboration (RTC) feature of JupyterLab and Jupyter Server, in a standalone and distributed (simulated and real) setups.

## Why do we need this?

The dependencies for a functional RTC are spread in various repositories (at least 6).  This single repository ensures that the full stack is covered. Is also ships tools to measure the quality and perfomance of the RTC system, think to `You can not scale what you can not measure...`

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

## Architecture

More information about the details of the implementation can be read on [this document](https://github.com/datalayer/jupyter-rtc-test/blob/main/docs/README.md).

## Coverage

This repository contains source code taken from the various repositories under `BSD-3` or `MIT` license. The following subsections highligh the various test that starting from the lower layers to the higher ones.

PS: In case of doubt, kill any ghost process.

```bash
yarn kill
```

### 1. Y.js

- https://github.com/yjs/yjs

JavaScript shared data types for building collaborative software.

```bash
yarn test
yarn test:py
```

### 2. Y-CRDT

- https://github.com/y-crdt/y-crdt

Rust port of Y.js with WASM javascript artificats.

```bash
yarn test
yarn test:py
```

### 3. Y.py

- https://github.com/y-crdt/ypy

Python bindings to `y-crdt`.

```bash
yarn test
yarn test:py
```

### 4. Y.py WebSocket

- https://github.com/y-crdt/ypy-websocket

WebSocket connector for `ypy`.

```bash
yarn test
yarn test:py
```

### 5. Jupyter YDoc

- https://github.com/jupyter-server/jupyter_ydoc

Jupyter document structures for collaborative editing using `Y.js` JavaScript and `ypy` Python.

```bash
yarn test
yarn test:py
```

### 6. Jupyter Collaboration

- https://github.com/jupyterlab/jupyter_collaboration

The JupyterLab extension that delivers the RTC functionality to the end-user.

```bash
yarn test
yarn test:py
```

## User Interface

You can also run the tests from a JupyterLab extension.

```bash
# open http://localhost:8686/api/jupyter/lab?token=60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6
yarn jupyterlab
```

You can also run the tests from a Jupyter Server application.

```bash
# open http://localhost:8888/jupyter_rtc_test?token=142461e29e03250e569824cff00bc99941148a334ff258e5
yarn jupyter-rtc-test
```
