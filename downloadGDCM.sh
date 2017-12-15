#!/bin/sh
echo Downloading gdcm
mkdir -p downloads
cd downloads ; \
if [ -d "GDCM" ]; then \
	echo "GDCM already downloaded\n\n" ; \
else \
	git clone -b release https://github.com/malaterre/GDCM.git ; \
	echo "Downloaded" ; \
fi;
