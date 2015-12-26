#!/bin/bash

if [ -z "$1" ] && [ -z "$2" ]
then
  docker build -t vhalme/omatalous-app .
  exit
fi

if [ "$1" == "--no-cache" ]
then
  docker build -t vhalme/omatalous-app --no-cache .
  exit
fi

docker build -t vhalme/omatalous-app:$1 .
if [ ! -z "$2" ]
then
  if [ "$2" == "--no-cache" ]
  then
    docker build -t vhalme/omatalous-app:$1 --no-cache .
    exit
  fi
  docker tag vhalme/omatalous-app:$1 vhalme/omatalous-app:$2 $3 .
fi
