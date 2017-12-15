#!/bin/bash
set +e
./downloadEmscripten.sh
./downloadGDCM.sh
source ./downloads/emsdk-portable/emsdk_set_env.sh ; \
mkdir -p downloads/GDCM/build ; \
cd downloads/GDCM/build ; \
emconfigure cmake -D EMSCRIPTEN=1 -D GDCM_BUILD_DOCBOOK_MANPAGES=0 -D GDCM_DOCUMENTATION=0 -D BUILD_DOC=0 -D CMAKE_MODULE_PATH=$EMSCRIPTEN/cmake/ -D CMAKE_TOOLCHAIN_FILE=$EMSCRIPTEN/cmake/Modules/Platform/Emscripten.cmake -DCMAKE_AR=`which llvm-ar` -D OPJ_BIG_ENDIAN=0  -G "Unix Makefiles" ../ ; \
emconfigure cmake -D EMSCRIPTEN=1 -D GDCM_BUILD_DOCBOOK_MANPAGES=0 -D GDCM_DOCUMENTATION=0 -D BUILD_DOC=0 -D CMAKE_MODULE_PATH=$EMSCRIPTEN/cmake/ -D CMAKE_TOOLCHAIN_FILE=$EMSCRIPTEN/cmake/Modules/Platform/Emscripten.cmake -DCMAKE_AR=`which llvm-ar` -D OPJ_BIG_ENDIAN=0  -G "Unix Makefiles" ../ ; \
emmake make -j 9 ; \
echo done ;

	 