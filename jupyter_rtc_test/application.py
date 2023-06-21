"""The Jupyter RTC Test Server application."""
from __future__ import annotations

import os

import asyncio

from traitlets import Unicode
from traitlets import Float, Type

from jupyter_server.utils import url_path_join
from jupyter_server.extension.application import ExtensionApp, ExtensionAppJinjaMixin
from jupyter_server.extension.application import ExtensionApp

from ypy_websocket.ystore import BaseYStore

from .handlers import IndexHandler, ConfigHandler
from .echo.handler import WsEchoHandler
from .stresser.handler import WsStresserHandler
from .relay.handler import WsRelayHandler
from .rtc1.handlers import DocSessionHandler, YDocWebSocketHandler
from .rtc1.loaders import FileLoaderMapping
from .rtc1.stores import SQLiteYStore
from .rtc1.websocketserver import JupyterWebsocketServer


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
    file_poll_interval = Float(
        1,
        config=True,
        help="""The period in seconds to check for file changes on disk.
        Defaults to 1s, if 0 then file changes will only be checked when
        saving changes from the front-end.""",
    )
    document_cleanup_delay = Float(
        60,
        allow_none=True,
        config=True,
        help="""The delay in seconds to keep a document in memory in the back-end after all clients
        disconnect. Defaults to 60s, if None then the document will be kept in memory forever.""",
    )
    document_save_delay = Float(
        1,
        allow_none=True,
        config=True,
        help="""The delay in seconds to wait after a change is made to a document before saving it.
        Defaults to 1s, if None then the document will never be saved.""",
    )
    ystore_class = Type(
        default_value=SQLiteYStore,
        klass=BaseYStore,
        config=True,
        help="""The YStore class to use for storing Y updates. Defaults to an SQLiteYStore,
        which stores Y updates in a '.jupyter_ystore.db' SQLite database in the current
        directory.""",
    )


    def initialize_settings(self):
        self.settings.update(
            {
                "collaborative_file_poll_interval": self.file_poll_interval,
                "collaborative_document_cleanup_delay": self.document_cleanup_delay,
                "collaborative_document_save_delay": self.document_save_delay,
                "collaborative_ystore_class": self.ystore_class,
            }
        )
        self.log.info("Jupyter RTC Test Config {}".format(self.config))


    def initialize_handlers(self):
        # Set configurable parameters to YStore class
        for k, v in self.config.get(self.ystore_class.__name__, {}).items():
            setattr(self.ystore_class, k, v)
        self.ywebsocket_server = JupyterWebsocketServer(
            rooms_ready=False,
            auto_clean_rooms=False,
            ystore_class=self.ystore_class,
            log=self.log,
        )
        # self.settings is local to the ExtensionApp but here we need
        # the global app settings in which the file id manager will register
        # itself maybe at a later time.
        self.file_loaders = FileLoaderMapping(
            self.serverapp.web_app.settings, self.log, self.file_poll_interval
        )
        self.handlers.extend([
            ("jupyter_rtc_test", IndexHandler),
            (url_path_join("jupyter_rtc_test", "get_config"), ConfigHandler),
            (url_path_join("jupyter_rtc_test", "echo"), WsEchoHandler),
            (url_path_join("jupyter_rtc_test", "relay"), WsRelayHandler),
            (url_path_join("jupyter_rtc_test", "stresser"), WsStresserHandler),
            (r"/jupyter_rtc_test/room/(.*)", YDocWebSocketHandler, {
                    "document_cleanup_delay": self.document_cleanup_delay,
                    "document_save_delay": self.document_save_delay,
                    "file_loaders": self.file_loaders,
                    "ystore_class": self.ystore_class,
                    "ywebsocket_server": self.ywebsocket_server,
                },
            ),
            (r"/jupyter_rtc_test/session/(.*)", DocSessionHandler),
        ])


    async def stop_extension(self):
        # Cancel tasks and clean up
        await asyncio.wait(
            [
                asyncio.create_task(self.ywebsocket_server.clean()),
                asyncio.create_task(self.file_loaders.clear()),
            ],
            timeout=3,
        )

# -----------------------------------------------------------------------------
# Main entry point
# -----------------------------------------------------------------------------

main = launch_new_instance = JupyterRtcTestApp.launch_instance
