apt-get update
apt-get upgrade
apt-get install nodejs
apt-get install git
apt-get install wget
apt-get install tesseract
wget -O ~/../usr/share/tessdata/ind.traineddata "https://github.com/tesseract-ocr/tessdata/blob/master/ind.traineddata?raw=true"
git clone 
npm install

echo "[*] All dependencies have been installed, running the bot..."
npm run bot