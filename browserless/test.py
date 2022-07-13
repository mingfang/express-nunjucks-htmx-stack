import requests
from bs4 import BeautifulSoup

r = requests.get('http://httpbin.httpbin/headers')
print(r.text)