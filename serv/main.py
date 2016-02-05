#!/usr/bin/env python
# -*- coding: utf-8 -*-
# main import
#
import os.path
import tornado.auth
import tornado.escape

from tornado.ioloop import IOLoop
#
import tornado.web
from tornado.options import define, options, parse_command_line
#
# flask app bridge
#
from tornado.wsgi import WSGIContainer
from tornado.web import FallbackHandler
from flaskapp import app
#
# our other files
#from sn_login import *
#from chat import *
#
#import sys
#sys.path.append('acapella/')
#ys.path.append('b_logic/')


define("port", default=8889, help="run on the given port", type=int)

tr = WSGIContainer(app)

def main():
	parse_command_line()
	app = tornado.web.Application(
		[
			(r"/", tornado.web.RedirectHandler, {"url": "/static/gui/tree5.html"}),  # default url when starting
			(r".*", FallbackHandler, dict(fallback=tr)),    # Flask Bridge
			],
		cookie_secret="__TODO:dscasdcasdcasdcasdcasrgwvrger",
		#
		static_path=os.path.join(os.path.dirname(__file__), "static"),
		xsrf_cookies=False,
		debug=True,
		gzip = True,
		)
	app.listen(options.port)
	# for tornado IOLOOP
	tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
	main() # old
	#print 'main'
	#import cProfile #new
	#print 'import cProfile'
	#cProfile.run('main()', 'service.pstats')

