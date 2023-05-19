"""Jupyter RTC Test handlers."""

import json

import tornado

from jupyter_server.base.handlers import APIHandler, JupyterHandler
from jupyter_server.extension.handler import ExtensionHandlerMixin, ExtensionHandlerJinjaMixin

from genson import SchemaBuilder


# pylint: disable=W0223
class BaseTemplateHandler(ExtensionHandlerJinjaMixin, ExtensionHandlerMixin, JupyterHandler):
    """The Base handler for the templates."""


class IndexHandler(BaseTemplateHandler):
    """The handler for the index."""

    @tornado.web.authenticated
    def get(self):
        """The index page."""
        self.write(self.render_template("index.html"))


class ConfigHandler(ExtensionHandlerMixin, APIHandler):
    """The handler for configurations."""

    @tornado.web.authenticated
    def get(self):
        """Returns the configurations of the server extensions."""
        res = json.dumps({
            "data": "This is /jupyter_rtc_test/get_config endpoint.",
        })
        self.finish(res)
