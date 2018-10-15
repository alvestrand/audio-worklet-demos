#!/usr/bin/python
#
# Python 2.7 server that adds "no-cache"
#
import SimpleHTTPServer

class NonCachingRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
  def end_headers(self):
    self.send_my_headers()
    SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

  def send_my_headers(self):
    self.send_header("Cache-control", "no-cache, no-store, must-revalidate")
    self.send_header("Pragma", "no-cache")
    self.send_header("Expires", "0")

if __name__ == '__main__':
  SimpleHTTPServer.test(HandlerClass=NonCachingRequestHandler)
