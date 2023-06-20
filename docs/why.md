# Why do we need to test Jupyter RTC

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

