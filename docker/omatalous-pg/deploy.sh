#!/bin/bash

tag=""
if [ ! -z "$1" ]
then
  tag=":$1"
fi

./shutdown.sh
docker run -d -P \
  -e DB_USER=devuser \
  -e DB_PASSWORD=devpasswd \
  --volumes-from omatalous-data --name omatalous-pg vhalme/omatalous-pg$tag
