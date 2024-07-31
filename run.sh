#!/bin/bash

while true; do
    git pull
    npm i
    npm start
    echo "Server crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
