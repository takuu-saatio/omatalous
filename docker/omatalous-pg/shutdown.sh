#!/bin/bash

container="$(docker ps -a | grep omatalous-pg | awk '{ print $7 }')"
if [ -z "$container" ]
then
  echo "omatalous-pg already removed"
  exit
fi

docker stop omatalous-pg
docker rm omatalous-pg
