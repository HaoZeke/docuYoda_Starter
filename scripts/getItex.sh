#!/usr/bin/env sh

if [ ! -f $HOME/save/itex ]; then
    aria2c https://github.com/dopefishh/itex/blob/master/itex -d $HOME/save -o itex
    aria2c https://github.com/dopefishh/itex/blob/master/tlmgri -d $HOME/save -o tlmgri
fi

sudo mv $HOME/save/itex /bin/itex
sudo mv $HOME/save/tlmgri /bin/tlmgri
