from ._version import __version__
from .handlers import setup_handlers


def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": "@datalayer/jupyter-rtc-test"
    }]


def _jupyter_server_extension_points():
    return [{
        "module": "jupyter_rtc_test"
    }]


def _load_jupyter_server_extension(server_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.

    Parameters
    ----------
    server_app: jupyter_server.serverapp.ServerApp
    """
    setup_handlers(server_app.web_app)
    name = "jupyter_rtc_test"
    server_app.log.info(f"Registered {name} server extension")


# For backward compatibility with notebook server - useful for Binder/JupyterHub
load_jupyter_server_extension = _load_jupyter_server_extension
