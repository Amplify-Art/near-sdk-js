#!/usr/bin/env bash
## Run this script with `npm run build`

near-sdk build src/unordered-map.js build/unordered-map.base64
near-sdk build src/vector.js build/vector.base64
