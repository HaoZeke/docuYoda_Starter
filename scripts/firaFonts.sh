cd $HOME/save

if [ ! -f FiraFonts4106.zip ]; then
    aria2c "http://www.carrois.com/downloads/fira_4_1/FiraFonts4106.zip"
fi

if [ ! -f FiraMonoFonts3206.zip ]; then
    aria2c "http://www.carrois.com/downloads/fira_mono_3_2/FiraMonoFonts3206.zip"
fi

unzip -n FiraFonts4106.zip
unzip -n FiraMonoFonts3206.zip

sudo mkdir -p /usr/share/fonts/truetype/Fira
sudo mkdir -p /usr/share/fonts/opentype/Fira
sudo cp Fira*/WEB/*.ttf /usr/share/fonts/truetype/Fira/
sudo cp Fira*/OTF/Fira* /usr/share/fonts/opentype/Fira/

sudo fc-cache -fv
