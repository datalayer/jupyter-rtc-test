[![Datalayer](https://assets.datalayer.design/datalayer-25.svg)](https://datalayer.io)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)

# Jupyter RTC Test

> 📶 Stress tests for 🪐 Jupyter 🔌 Real Time Collaboration (RTC).

The goal of this repository is to stress test the Real Time Collaboration (RTC) feature of JupyterLab and Jupyter Server and is a needed requirement [to avoid users having issues when they enable RTC](./docs/why.md).

You can run the stress tests from the CLI (Command Line Interface) or from a UI (User Interface).

<div align="center" style="text-align: center">
  <img alt="Jupyter RTC Test" src="https://datalayer-jupyter-examples.s3.amazonaws.com/jupyter-rtc-test.gif" />
</div>

## Distributed Actors

The tests aims to replicate real life cases, meaning that most of them are running in a distrbuted way.

You can run the tests on a standalone (local laptop or CI) machine, in which case the distributed behavior is simulated. You can also run the tests in a real a distributed environment like Kubernetes, this however requires you to setup additional infrastructure and configuration. Please note you can also run the Kubernetes flavored tests on a local Minikube instance.

<div align="center" style="text-align: center">
  <img alt="Jupyter RTC Test Actors" src="https://raw.githubusercontent.com/datalayer/jupyter-rtc-test/main/style/svg/jupyter-rtc-test-actors.image.svg" />
</div>

## Discovered issues and Explored solutions

We maintain [a list of discovered issues](./docs/issues.md) as well a [explored solutions](./docs/solutions.md).

## Jupyter RTC Stack

The Jupyter RTC Stack is spread across various repositories

- Yjs https://github.com/yjs/yjs
- Yrs https://github.com/y-crdt/y-crdt/tree/main/yrs
- Ywasm https://github.com/y-crdt/y-crdt/tree/main/ywasm
- Ypy https://github.com/y-crdt/ypy
- Ystore see https://github.com/y-crdt/ypy-websocket/issues/19
- Ypy Websocket https://github.com/y-crdt/ypy-websocket
- Jupyter YDoc https://github.com/jupyter-server/jupyter_ydoc
- Jupyter Collaboration https://github.com/jupyterlab/jupyter_collaboration

<div align="center" style="text-align: center">
  <img alt="Jupyter RTC Stack" src="https://raw.githubusercontent.com/datalayer/jupyter-rtc-test/main/style/svg/jupyter-rtc-stack.image.svg" />
</div>

## Community

The RTC stress test are being discussed [in an issue on the official JupyterLab repository](https://github.com/jupyterlab/jupyterlab/issues/14532).
<!--
## Install

[Install](./docs/install.md) the tool directly from PyPI and [launch it](./docs/use.md) from the command line.
-->
## Develop

Setup your [environment](./docs/environment.md) to run the [tests](./docs/tests.md).

You can also use the [user interface](./docs/ui.md) if you prefer.

## About CRDT

You can read more about the Conflict free Replicated Data Types (CRDT).

- [CRDT.tech](https://crdt.tech)
- [Jupyter Real Time Collaboration | JupyterCon 2020](https://www.youtube.com/watch?v=G5CVtJIBE5I)
- [Wikipedia](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
- [Y.js](https://docs.yjs.dev) used as CRDT implementation.

## ⚖️ License

Copyright (c) 2023 Datalayer, Inc.

Released under the terms of the BSD 3-Clause license (see [LICENSE](./LICENSE)).

This repository contains source code taken from the various repositories under `BSD-3` or `MIT` license. 
