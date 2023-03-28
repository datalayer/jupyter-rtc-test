import json

import tornado

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join


class JupyterRtcTestHandler(APIHandler):

    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /jupyter_rtc_test/get_example endpoint!"
        }))


def setup_handlers(web_app):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "jupyter_rtc_test", "get_example")
    handlers = [(route_pattern, JupyterRtcTestHandler)]
    """
    handlers.extend([
        (r'/jupyter_rtc_test/default', DefaultHandler),
        (r'/jupyter_rtc_test/example', ExampleHandler),
        (r'/jupyter_rtc_test/collaboration', WsRTCManager),
    ])
    """
    web_app.add_handlers(host_pattern, handlers)
