#!/bin/bash

if [ -z "$1" ] && [ -z "$2" ]
then
  docker build -t vhalme/omatalous-app .
  exit
fi

docker build -t vhalme/omatalous-app:$1 .
if [ ! -z "$2" ]
then
  docker tag vhalme/omatalous-app:$1 vhalme/omatalous-app:$2
fi
