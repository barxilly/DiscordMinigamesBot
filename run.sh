#!/bin/bash

while true; do
    npm i
    npm start
    echo "Server crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
