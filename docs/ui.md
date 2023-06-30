# User Interfaces

Upon running the RTC tests from the CLI, you can also run them from various user interfaces as:

- A Web Application.
- A Jupyter Server Application.
- A JupyterLab Extension.

<div align="center" style="text-align: center">
  <img alt="Jupyter RTC Test" src="https://datalayer-jupyter-examples.s3.amazonaws.com/jupyter-rtc-test.gif" />
</div>

You can choose a test scenario that will spins remote users.

<div align="center" style="text-align: center">
  <img alt="Jupyter RTC Test Actors" src="https://raw.githubusercontent.com/datalayer/jupyter-rtc-test/main/style/svg/jupyter-rtc-test-actors.image.svg" />
</div>

## Web Application

```bash
# open http://localhost:3063
yarn start
```

## Jupyter Server Application

```bash
# open http://localhost:8888/jupyter_rtc_test?token=142461e29e03250e569824cff00bc99941148a334ff258e5
yarn jupyter-rtc-test
# ...or
jupyter rtc-test
# ...or
python -m jupyter_rtc_test
```

## JupyterLab Extension

```bash
# open http://localhost:8888/api/jupyter/lab?token=60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6
yarn jupyterlab
# ... or
jupyter lab
```
