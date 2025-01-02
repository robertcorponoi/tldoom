#!/bin/sh

# Change to the sdldoom directory, which contains the source that we want to 
# build.
cd sdldoom-1.10

# Ensures the C89 standard is used during compilation.
# Tells emscripten to use the SDL library,
export EMCC_CFLAGS="-std=c89 -sUSE_SDL"

# Runs the configure script with emscripten-specific adaptations. This 
# checks our environment and prepares the Makefile for building Doom.
emconfigure ./configure

# Builds the project using Make.
emmake make

# Compiles the code to WebAssembly.
# Specifies the output as `index.js`.
# Include the doom wad file in the output as a preloaded file.
# Allows WebAssembly memory to dynamically grow during runtime.
emcc -o index.js ./*.o --preload-file ../public/doom1.wad@./ -s ALLOW_MEMORY_GROWTH=1

# Move the generated files to the public directory.
mv index.* ../public