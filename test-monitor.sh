#!/usr/bin/env bash
nodemon node_modules/mocha/bin/mocha $(find . -path ./node_modules -prune -o -name *.spec.js -print)
