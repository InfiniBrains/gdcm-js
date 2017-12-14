all: download-all

download-all: download-emscripten download-gdcm

download-emscripten:
	echo Downloading emscripten ...
	mkdir -p downloads
	cd downloads ; \
	if [ -a "emsdk-portable.tar.gz" ]; then \
		echo Already downloaded ; \
	else \
		wget -N https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz ; \
		tar -xf emsdk-portable.tar.gz ; \
		cd emsdk-portable ; \
		./emsdk update ; \
		./emsdk install latest ; \
		./emsdk activate latest ; \
		echo Downloaded ; \
	fi;

download-gdcm:
	echo Downloading gdcm
	mkdir -p downloads
	cd downloads ; \
	if [ -d "GDCM" ]; then \
		echo GDCM already downloaded ; \
	else \
		git clone -b release https://github.com/malaterre/GDCM.git ; \
		echo Downloaded ; \
	fi;

clean:
	- rm -rf downloads
	 