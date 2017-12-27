md downloads
cscript /nologo wget.js https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable-64bit.zip downloads/emsdk.zip
cscript /nologo wget.js http://stahlworks.com/dev/unzip.exe downloads/unzip.exe
cscript /nologo wget.js https://cmake.org/files/v3.10/cmake-3.10.1-win64-x64.zip downloads/cmake.zip
cscript /nologo wget.js https://github.com/malaterre/GDCM/archive/v2.8.3.zip downloads/gdcm.zip
cd downloads
md emsdk
unzip.exe cmake.zip
ren cmake-3.10.1-win64-x64 cmake
unzip.exe gdcm.zip
ren GDCM-2.8.3 gdcm
unzip.exe emsdk.zip -d emsdk
cd emsdk
emsdk.bat install git-1.9.4
emsdk.bat activate git-1.9.4
emsdk.bat update
emsdk.bat install sdk-1.37.18-64bit
emsdk.bat activate sdk-1.37.18-64bit
emsdk.bat install mingw-7.1.0-64bit 
emsdk.bat activate mingw-7.1.0-64bit
emsdk.bat install gnu-2.5.4
emsdk.bat activate gnu-2.5.4
cd ..
cd gdcm
md build
cd build
emconfigure %EMSDK%/../cmake/bin/cmake.exe -G "MinGW Makefiles" -DCMAKE_TOOLCHAIN_FILE=%EMSCRIPTEN%/cmake/Modules/Platform/Emscripten.cmake -DGDCM_BUILD_DOCBOOK_MANPAGES=0 -DGDCM_BUILD_APPLICATIONS=1 -DGDCM_BUILD_EXAMPLES=1 -DEMSCRIPTEN=1 -DEMSCRIPTEN_GENERATE_BITCODE_STATIC_LIBRARIES=1 ..
mingw32-make -j 9
cd ..
cd ..
cd ..
em++ gdcmconv.cpp -Idownloads/gdcm/build/bin -Idownloads/gdcm/build/Source/Common -Idownloads/gdcm/build/Source/Common -Idownloads/gdcm/build/Source/DataStructureAndEncodingDefinition -Idownloads/gdcm/build/Source/MediaStorageAndFileFormat -Idownloads/gdcm/build/Source/InformationObjectDefinition -Idownloads/gdcm/build/Source/MessageExchangeDefinition -Idownloads/gdcm/build/Source/DataDictionary -Idownloads/gdcm/build/Utilities -Idownloads/gdcm/build/Utilities/socketxx -Idownloads/gdcm/build/Utilities/socketxx/socket++ -Idownloads/gdcm/build/Utilities/socketxx/socket++ -Idownloads/gdcm/build/Utilities/gdcmopenjpeg -Idownloads/gdcm/Source/DataStructureAndEncodingDefinition -Idownloads/gdcm/Source/Common -Idownloads/gdcm/Source/MediaStorageAndFileFormat -Idownloads/gdcm/Source/DataDictionary -Oz -s FORCE_FILESYSTEM=1 -s NODEJS_CATCH_EXIT=0 -s DISABLE_EXCEPTION_CATCHING=0 --post-js pos.js --pre-js pre.js --closure 1 -o gdcmconv.js downloads/gdcm/build/bin/libgdcmCommon.bc downloads/gdcm/build/bin/libgdcmIOD.bc downloads/gdcm/build/bin/libgdcmcharls.bc downloads/gdcm/build/bin/libgdcmjpeg16.bc downloads/gdcm/build/bin/libgdcmuuid.bc downloads/gdcm/build/bin/libgdcmDICT.bc downloads/gdcm/build/bin/libgdcmMEXD.bc downloads/gdcm/build/bin/libgdcmexpat.bc downloads/gdcm/build/bin/libgdcmjpeg8.bc downloads/gdcm/build/bin/libgdcmzlib.bc downloads/gdcm/build/bin/libgdcmDSED.bc downloads/gdcm/build/bin/libgdcmMSFF.bc downloads/gdcm/build/bin/libgdcmjpeg12.bc downloads/gdcm/build/bin/libgdcmopenjp2.bc downloads/gdcm/build/bin/libsocketxx.bc
