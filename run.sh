#!/bin/bash
# rm -rf node_modules
npm i
# rm package-lock.json
export PORT=$1
exec node -r dotenv/config app.js
