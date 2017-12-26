#!/bin/bash
set +e
./downloadEmscripten.sh
./downloadGDCM.sh
source ./downloads/emsdk-portable/emsdk_set_env.sh ; \
mkdir -p downloads/GDCM/build ; \
cd downloads/GDCM/build ; \
emconfigure cmake -DTEST_BIG_ENDIAN=0 -DEMSCRIPTEN=1 -DGDCM_BUILD_DOCBOOK_MANPAGES=0 -DGDCM_DOCUMENTATION=0 -DBUILD_DOC=0 -DCMAKE_MODULE_PATH=$EMSCRIPTEN/cmake/ -DCMAKE_TOOLCHAIN_FILE=$EMSCRIPTEN/cmake/Modules/Platform/Emscripten.cmake -DCMAKE_AR=`which llvm-ar` -DOPJ_BIG_ENDIAN=0 -DCMAKE_CXX_COMPILER=`which em++` -DCMAKE_C_COMPILER=`which emcc` -DCMAKE_STATIC_LIBRARY_SUFFIX=".bc" -DCMAKE_SHARED_LIBRARY_SUFFIX=".bc" -G "Unix Makefiles" ../ ; \
emconfigure cmake -DTEST_BIG_ENDIAN=0 -DEMSCRIPTEN=1 -DGDCM_BUILD_DOCBOOK_MANPAGES=0 -DGDCM_DOCUMENTATION=0 -DBUILD_DOC=0 -DCMAKE_MODULE_PATH=$EMSCRIPTEN/cmake/ -DCMAKE_TOOLCHAIN_FILE=$EMSCRIPTEN/cmake/Modules/Platform/Emscripten.cmake -DCMAKE_AR=`which llvm-ar` -DOPJ_BIG_ENDIAN=0 -DCMAKE_CXX_COMPILER=`which em++` -DCMAKE_C_COMPILER=`which emcc` -DCMAKE_STATIC_LIBRARY_SUFFIX=".bc" -DCMAKE_SHARED_LIBRARY_SUFFIX=".bc" -G "Unix Makefiles" ../ ; \
emmake make -j 9 ; \
echo done ;