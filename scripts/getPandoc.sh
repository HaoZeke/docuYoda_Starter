if [ ! -f $HOME/save/pand2.deb ]; then
    aria2c https://github.com/jgm/pandoc/releases/download/2.0.1.1/pandoc-2.0.1.1-1-amd64.deb -d $HOME/save -o pand2.deb

fi

sudo dpkg -i $HOME/save/pand2.deb