# Why do we need to test Jupyter RTC in a distributed way?

The dependencies for a functional RTC are spread in various repositories (at least 6). Each of those repositories test their API and behavior in a classic `unit test` approach.

With the [Jupyter RTC Test](https://github.com/datalayer/jupyter-rtc-test) repository, we strive to ensure that the full stack is covered. Is also ships tools to measure the quality and perfomance of the RTC system, think to `You can not scale what you can not measure...`

Historically, there have been a few RTC failures reported, with quite low user traffic.

- [OPEN] Lab 4 editor corrupting simple CSV files when collaborative mode is on https://github.com/jupyterlab/jupyterlab/issues/14715
- [OPEN] Incorrect file name shown on tab for markdown file https://github.com/jupyterlab/jupyterlab/issues/14763
- [OPEN] CRITICAL - data loss and notebook corruption on a hosted Lab instance https://github.com/jupyterlab/jupyterlab/issues/12154
- [OPEN] Non-empty notebooks appear as blank https://github.com/jupyterlab/jupyterlab/issues/13930
- [OPEN] Damaged notebook (duplicate cells) in RTC-active hosted hub https://github.com/jupyterlab/jupyterlab/issues/14031
- [OPEN] Development workflow with RTC https://github.com/jupyterlab/jupyterlab/issues/14170
- [OPEN] Collaboration mode rolls back progress https://github.com/jupyterlab/jupyterlab/issues/14224
- [OPEN] Collaboration rolls back progress https://github.com/jupyterlab/jupyterlab/issues/14278
- [OPEN] Collaboration breaks notebooks https://github.com/jupyterlab/jupyterlab/issues/14343
- [OPEN] Trusting notebook in RTC mode leads to File Changed dialog  https://github.com/jupyterlab/jupyterlab/issues/14347

We need now to make sure the system is robust enough at scale, and also identify their limits.
