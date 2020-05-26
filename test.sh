#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

export PORT=32743

echo "starting server"
node "${SCRIPT_DIR}/server.js" &
PID=$!
echo "started server PID=${PID}"

echo "waiting 3 seconds for server to come up"
sleep 3

echo "about to curl localhost:${PORT}"
curl --fail "localhost:${PORT}"

echo "killing pid ${PID}"
kill ${PID}

while kill -0 ${PID} >/dev/null 2>&1; do 
  echo "waiting for process to die"
  sleep 1
done
