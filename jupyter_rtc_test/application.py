"""The Jupyter RTC Test Server application."""

import os

from traitlets import Unicode

from jupyter_server.utils import url_path_join
from jupyter_server.extension.application import ExtensionApp, ExtensionAppJinjaMixin

from .handlers import ConfigHandler, IndexHandler


DEFAULT_STATIC_FILES_PATH = os.path.join(os.path.dirname(__file__), "./static")

DEFAULT_TEMPLATE_FILES_PATH = os.path.join(os.path.dirname(__file__), "./templates")


class JupyterRtcTestApp(ExtensionAppJinjaMixin, ExtensionApp):
    """The Jupyter Server extension."""

    name = "jupyter_rtc_test"

    extension_url = "/jupyter_rtc_test"

    load_other_extensions = True

    static_paths = [DEFAULT_STATIC_FILES_PATH]
    template_paths = [DEFAULT_TEMPLATE_FILES_PATH]

    config_a = Unicode("", config=True, help="Config A example.")
    config_b = Unicode("", config=True, help="Config B example.")
    config_c = Unicode("", config=True, help="Config C example.")

    def initialize_settings(self):
        self.log.info("Jupyter RTC Test Config {}".format(self.config))

    def initialize_handlers(self):
        handlers = [
            ("jupyter_rtc_test", IndexHandler),
            (url_path_join("jupyter_rtc_test", "get_config"), ConfigHandler),
        ]
        self.handlers.extend(handlers)


# -----------------------------------------------------------------------------
# Main entry point
# -----------------------------------------------------------------------------

main = launch_new_instance = JupyterRtcTestApp.launch_instance
