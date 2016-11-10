#!/bin/sh
rm -rf dist
npm test
cp README.md dist
cp package.json dist
rm -rf dist/tests
( cd dist ; npm publish )