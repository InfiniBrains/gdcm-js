#!/usr/bin/env bash
set -e

# (a) dependency checks
for tool in git cmake curl make; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo " Missing dependency: $tool"
    exit 1
  fi
done

# (b) parallel jobs
JOBS=$(getconf _NPROCESSORS_ONLN 2>/dev/null || nproc)

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
mkdir -p downloads

# (c) emsdk 6.0.13
if [ ! -d downloads/emsdk ]; then
  git clone https://github.com/emscripten-core/emsdk.git downloads/emsdk
fi
pushd downloads/emsdk >/dev/null
# ensure a modern python is used by emsdk (stray old emsdk pythons on PATH break it)
if command -v python3 >/dev/null 2>&1; then
  export EMSDK_PYTHON="$(command -v python3)"
fi
if [ ! -d upstream ]; then
  ./emsdk install 6.0.13
  ./emsdk activate 6.0.13
fi
source ./emsdk_env.sh
popd >/dev/null

# (d) GDCM v3.2.11
if [ ! -f downloads/gdcm-v3.2.11.tar.gz ]; then
  curl -L -o downloads/gdcm-v3.2.11.tar.gz https://github.com/malaterre/GDCM/archive/refs/tags/v3.2.11.tar.gz
fi
if [ ! -d downloads/gdcm ]; then
  tar -xzf downloads/gdcm-v3.2.11.tar.gz -C downloads
  mv downloads/GDCM-3.2.11 downloads/gdcm
fi

# (e) cross-build GDCM static libs with emscripten
mkdir -p downloads/gdcm/build
pushd downloads/gdcm/build >/dev/null
emcmake cmake -DCMAKE_BUILD_TYPE=Release \
  -DGDCM_BUILD_APPLICATIONS=0 \
  -DGDCM_BUILD_EXAMPLES=0 \
  -DGDCM_BUILD_DOCBOOK_MANPAGES=0 \
  -DBUILD_SHARED_LIBS=0 \
  -DEMSCRIPTEN=1 ..
make -j"$JOBS"
popd >/dev/null

# (f) verify build products
if [ -z "$(find downloads/gdcm/build -name 'libgdcmCommon.a')" ]; then
  echo "Build verification failed: libgdcmCommon.a not found"
  exit 1
fi
find downloads/gdcm/build -name 'libgdcm*.a' -o -name 'libsocketxx.a'

# per-app linking happens in the artifact step
