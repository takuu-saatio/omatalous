#!/bin/bash

container="$(docker ps -a | grep omatalous-app | awk '{ print $7 }')"
if [ -z "$container" ]
then
  echo "omatalous-app already removed"
  exit
fi

docker stop omatalous-app
docker rm omatalous-app
