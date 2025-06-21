#!/bin/sh

# Make some user zips the quick and dirty way.
#
# ASSUMPTIONS:
# 1. The minification step is run separatel beforehand (npm run build)
# 2. The 
# * No grunt, artifact registries, or worse things
# * Gets us ready and shipped ASAP


stderr() {
    echo "$@" 1>&2
}

error() {
    stderr "ERROR: $@"
}

clean_zip() {
    local zip_path="$1"
    echo "Checking for zip '${zip_path}'..."
    if [ -e "${TEMPLATE_ZIP_PATH}" ]; then
        echo " FOUND  : deleting!"
        rm "${TEMPLATE_ZIP_PATH}"
    else
        echo " ABSENT : does not exist?"
    fi
}

make_zip() {
    local zip_path="$1"
    shift
    echo "Checking for ${zip_path} requirements"
    for file in "$@"; do
        echo "  File '${file}'... "
        if [ ! -e "${file}" ]; then
            echo  "    Missing!"
            error "Cannot proceed without required file '${file}'!"
            exit 1
        else
            echo  "    Found!"
        fi
    done
    zip "$zip_path" "$@"
}

MIN_ZIP_PATH="static/template/skink.min.js.zip"
TEMPLATE_ZIP_PATH="static/template/template.zip"

clean_zip "$TEMPLATE_ZIP_PATH"
clean_zip "$MIN_ZIP_PATH"

echo "Building zips"

cp dist/skink.min.js static/template/skink.min.js

echo "Changing into template dir"
cd static/template

make_zip template.zip index.html bigrange.css skink.min.js
make_zip skink.min.js.zip skink.min.js

echo "Out of template dir"

cd ../..

echo "Building doc"

