echo Downloading emscripten ...
mkdir -p downloads
cd downloads ; \
if [ -a "emsdk-portable.tar.gz" ]; then \
	echo "Already downloaded\n\n" ; \
else \
	wget -N https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz ; \
	tar -xf emsdk-portable.tar.gz ; \
	cd emsdk-portable ; \
	./emsdk update ; \
	./emsdk install latest ; \
	./emsdk activate latest ; \
	./emsdk_env.sh ; \
	echo "Downloaded\n\n" ; \
fi;