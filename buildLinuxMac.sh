#!/usr/bin/env bash

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

CMAKE=`which cmake`
DoesCMAKEExist=`${CMAKE} --version || echo "false"`
if [[ ${DoesCMAKEExist} != false ]]; then
  echo "CMAKE is present"
else
  echo
  echo " Missing dependency: CMAKE (http://gnu.org/software/cmake)"
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

MAKE=`which make`
DoesMAKEExist=`${MAKE} --version || echo "false"`
if [[ ${DoesMAKEExist} != false ]]; then
  echo "MAKE is present"
else
  echo
  echo " Missing dependency: MAKE (http://gnu.org/software/make)"
  echo
  exit 1
fi

echo  "Downloading emscripten"
sleep 1

mkdir -p downloads
cd downloads
${GIT} clone https://github.com/emscripten-core/emsdk.git
${WGET} -c -nc https://github.com/malaterre/GDCM/archive/v2.8.9.tar.gz -O gdcm.tar.gz

echo  "Decompressing GDCM"
sleep 1

${TAR} -xvzf gdcm.tar.gz
mkdir -p gdcm
mv -f GDCM-2.8.9/* gdcm
rm -rf GDCM-2.8.9

#cd downloads
#md emsdk
#unzip.exe cmake.zip
#ren cmake-3.10.1-win64-x64 cmake
#unzip.exe gdcm.zip
#ren GDCM-2.8.3 gdcm
#unzip.exe emsdk.zip -d emsdk

echo  "Setting up emscripten"
sleep 1

cd emsdk
./emsdk update
./emsdk install latest
./emsdk activate latest

source ./emsdk_env.sh
#./emsdk install mingw-7.1.0-64bit
#emsdk.bat activate mingw-7.1.0-64bit
#emsdk.bat install gnu-2.5.4
#emsdk.bat activate gnu-2.5.4

echo  "Configuring gdcm"
cd ..
cd gdcm
mkdir build
cd build
emcmake cmake -DCMAKE_TOOLCHAIN_FILE=${EMSDK}/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DGDCM_BUILD_DOCBOOK_MANPAGES=0 -DGDCM_BUILD_APPLICATIONS=1 -DGDCM_BUILD_EXAMPLES=1 -DEMSCRIPTEN=1 ..
emcmake cmake -DCMAKE_TOOLCHAIN_FILE=${EMSDK}/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DGDCM_BUILD_DOCBOOK_MANPAGES=0 -DGDCM_BUILD_APPLICATIONS=1 -DGDCM_BUILD_EXAMPLES=1 -DEMSCRIPTEN=1 ..
${MAKE} -j 20
cd ..
cd ..
cd ..
for i in downloads/gdcm/Applications/Cxx/*.cxx; do
  NEWNAME=${i##*/} ;
  NEWNAME=${NEWNAME%%.*}.js ;
  echo "${i}" ;
  em++ "${i}" -o "${NEWNAME}" -s WASM=0 -s MODULARIZE=0 -s EXIT_RUNTIME=0 --memory-init-file 0 -Oz -s FORCE_FILESYSTEM=1 -s NODEJS_CATCH_EXIT=0 -s DISABLE_EXCEPTION_CATCHING=0 --closure 0 --post-js ./pos.js --pre-js ./pre.js -Idownloads/gdcm/build/Utilities/gdcmzlib -Idownloads/gdcm/Utilities -Idownloads/gdcm/Utilities/gdcmzlib -Idownloads/gdcm/Source/InformationObjectDefinition -Idownloads/gdcm/build/bin -Idownloads/gdcm/build/Source/Common -Idownloads/gdcm/build/Source/Common -Idownloads/gdcm/build/Source/DataStructureAndEncodingDefinition -Idownloads/gdcm/build/Source/MediaStorageAndFileFormat -Idownloads/gdcm/build/Source/InformationObjectDefinition -Idownloads/gdcm/build/Source/MessageExchangeDefinition -Idownloads/gdcm/build/Source/DataDictionary -Idownloads/gdcm/build/Utilities -Idownloads/gdcm/build/Utilities/socketxx -Idownloads/gdcm/build/Utilities/socketxx/socket++ -Idownloads/gdcm/build/Utilities/socketxx/socket++ -Idownloads/gdcm/build/Utilities/gdcmopenjpeg -Idownloads/gdcm/Source/DataStructureAndEncodingDefinition -Idownloads/gdcm/Source/Common -Idownloads/gdcm/Source/MediaStorageAndFileFormat -Idownloads/gdcm/Source/DataDictionary downloads/gdcm/build/bin/libgdcmCommon.a downloads/gdcm/build/bin/libgdcmIOD.a downloads/gdcm/build/bin/libgdcmcharls.a downloads/gdcm/build/bin/libgdcmjpeg16.a downloads/gdcm/build/bin/libgdcmuuid.a downloads/gdcm/build/bin/libgdcmDICT.a downloads/gdcm/build/bin/libgdcmMEXD.a downloads/gdcm/build/bin/libgdcmexpat.a downloads/gdcm/build/bin/libgdcmjpeg8.a downloads/gdcm/build/bin/libgdcmzlib.a downloads/gdcm/build/bin/libgdcmDSED.a downloads/gdcm/build/bin/libgdcmMSFF.a downloads/gdcm/build/bin/libgdcmjpeg12.a downloads/gdcm/build/bin/libgdcmopenjp2.a downloads/gdcm/build/bin/libsocketxx.a ;
done ;