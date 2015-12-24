#!/bin/bash

if [ -z "$1" ] && [ -z "$2" ]
then
  docker build -t vhalme/omatalous-pg .
  exit
fi

docker build -t vhalme/omatalous-pg:$1 .
if [ ! -z "$2" ]
then
  docker tag -f vhalme/omatalous-pg:$1 vhalme/omatalous-pg:$2
fi
