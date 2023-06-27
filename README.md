[![Datalayer](https://assets.datalayer.design/datalayer-25.svg)](https://datalayer.io)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)

# Jupyter RTC Test

> 📶 Stress tests for 🪐 Jupyter 🔌 Real Time Collaboration (RTC).

<div align="center" style="text-align: center">
  <img alt="Jupyter RTC Tests" src="https://datalayer-jupyter-examples.s3.amazonaws.com/jupyter-rtc-test.gif" />
</div>


The goal of this repository is to stress test the Real Time Collaboration (RTC) feature of JupyterLab and Jupyter Server and is a needed requirement [to avoid users having issues when they enable RTC](./docs/why.md).

The current list of discovered issues is [maintained on this page](./docs/issues.md).

The tests aims to replicate real life cases, meaning that most of them are running in a distrbuted way. You can run the test on a standalone (local laptop or CI) machine, in which case the distributed behavior is simulated.

You can also run the tests in a real a distributed environment like Kubernetes, this however requires you to setup additional infrastructure and configuration. Please note you can also run the Kubernetes flavored tests on a local Minikube instance.

## Install

[Install](./docs/install.md) the tool directly from PyPI and [launch it](./docs/use.md) from the command line.

## Develop

Setup your [environment](./docs/environment.md) to run the [tests](./docs/tests.md).

You can also use the [user interfaces](./docs/ui.md) if you prefer.

## ⚖️ License

Copyright (c) 2023 Datalayer, Inc.

Released under the terms of the BSD 3-Clause license (see [LICENSE](./LICENSE)).

This repository contains source code taken from the various repositories under `BSD-3` or `MIT` license. 
