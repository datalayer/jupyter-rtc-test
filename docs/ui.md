# User Interfaces

Upon running the RTC tests from the CLI, you can also run them from various user interfaces.

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
