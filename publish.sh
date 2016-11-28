#!/bin/sh
rm -rf dist
cp README.md dist
cp package.json dist
( cd dist ; npm publish )