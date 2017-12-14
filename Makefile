all: download-emscripten download-gdcm

download-emscripten:
	- mkdir downloads
	echo Downloading emsdk 
	- wget https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz -O downloads/emsdk-portable.tar.gz
	- cd downloads ; tar -xf emsdk-portable.tar.gz
	- downloads/emsdk-portable/emsdk update
	- downloads/emsdk-portable/emsdk install latest
download-gdcm:
	 