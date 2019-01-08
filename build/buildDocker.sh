#!/usr/bin/env bash
cd ..

echo  "Checking toolset"
sleep 1

## check for wget
WGET=`which wget`
DoesWGETExist=`${WGET} --version || echo "false"`
if [[ ${DoesWGETExist} != false ]]; then
  echo "WGET is present"
else
  echo
  echo " Missing dependency: wget (http://gnu.org/software/wget)"
  echo
  exit 1
fi

GIT=`which git`
DoesGITExist=`${GIT} --version || echo "false"`
if [[ ${DoesGITExist} != false ]]; then
  echo "GIT is present"
else
  echo
  echo " Missing dependency: git (http://gnu.org/software/git)"
  echo
  exit 1
fi

TAR=`which tar`
DoesTARExist=`${TAR} --version || echo "false"`
if [[ ${DoesTARExist} != false ]]; then
  echo "TAR is present"
else
  echo
  echo " Missing dependency: TAR (http://gnu.org/software/tar)"
  echo
  exit 1
fi

mkdir -p downloads
cd downloads
${GIT} clone https://github.com/juj/emsdk.git
${WGET} -c -nc https://github.com/malaterre/GDCM/archive/v2.8.8.tar.gz -O gdcm.tar.gz

echo  "Decompressing GDCM"
sleep 1

${TAR} -xvzf gdcm.tar.gz
mkdir -p gdcm
mv -f GDCM-2.8.8/* gdcm
rm -rf GDCM-2.8.8

docker run --rm -v $(pwd):/src trzeci/emscripten emcc helloworld.cpp -o helloworld.js

trzeci/emscripten