#!/usr/bin/env sh

if [ ! -f $HOME/save/pand2.deb ]; then
    aria2c https://github.com/jgm/pandoc/releases/download/2.1.3/pandoc-2.1.3-1-amd64.deb -d $HOME/save -o pand2.deb
fi

sudo dpkg -i $HOME/save/pand2.deb