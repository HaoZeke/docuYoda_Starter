#!/usr/bin/env python3
"""
Replace $hLinks with a nav list of all headers;
uses optional metadata value 'toc-depth'
Based on discussions here: https://github.com/sergiocorreia/panflute/issues/73

Copyright (C) 2017  Rohit Goswami <rohit1995@mail.ru>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>. 

"""

from panflute import *
import re

def prepare(doc):
    doc.hLinks = []
    doc.depth = int(doc.get_metadata('toc-depth', default=1))


def action(elem, doc):
    if isinstance(elem, Header) and elem.level <= doc.depth:
        plain = stringify(elem)
        item = Link(*elem.content,url="#"+stringify(elem).replace(" ", "-").lower())
        doc.hLinks.append(item)


def finalize(doc):
    divs = []
    for x in range(len(doc.hLinks)):
       divs = [Div(Plain(x), classes=['navItem']) for x in doc.hLinks]
    divR = Div(*divs)
    doc = doc.replace_keyword('$hLinks', divR)


def main(doc=None):
    return run_filter(action, prepare=prepare, finalize=finalize, doc=doc) 


if __name__ == '__main__':
    main()
