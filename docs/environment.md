# Develop

You need [Miniconda](https://docs.conda.io/en/latest/miniconda.html) up-and-running on your machine.

Clone the `jupyter-rtc-test` repository.

```bash
git clone https://github.com/datalayer/jupyter-rtc-test.git && \
  cd jupyter-rtc-test
```

If you already have created a conda environment with name `jupyter-rtc-test`, please remove it.

```bash
conda deactivate && \
  make env-rm
```

Create a new conda environment.

```bash
make env && \
  conda activate jupyter-rtc-test
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

**⚡ Watch out ⚡** The tests will not work with the `pytest-tornasync` or the `pytest-jupyter` plugins install. To avoid issues, run the following commands.

```bash
pip uninstall -y pytest-tornasync
pip uninstall -y pytest-jupyter
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
