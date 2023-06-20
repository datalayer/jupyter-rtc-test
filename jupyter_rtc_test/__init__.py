from typing import Any, Dict, List

from ._version import __version__
from .application import JupyterRtcTestApp


def _jupyter_labextension_paths() -> List[Dict[str, str]]:
    return [{
        "src": "labextension",
        "dest": "@datalayer/jupyter-rtc-test"
    }]


def _jupyter_server_extension_points() -> List[Dict[str, Any]]:
    return [{
        "module": "jupyter_rtc_test",
        "app": JupyterRtcTestApp,
    }]
