#!/bin/bash

tag=""
if [ ! -z "$1" ]
then
  tag=":$1"
fi

./shutdown.sh
docker run -d -P \
  -e DB_USER=<db_user> \
  -e DB_PASSWORD=<db_password> \
  --volumes-from omatalous-data --name omatalous-pg vhalme/omatalous-pg$tag
