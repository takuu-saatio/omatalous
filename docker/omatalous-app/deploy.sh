#!/bin/bash

tag=""
if [ ! -z "$1" ]
then
  tag=":$1"
fi

./shutdown.sh
docker run -d -p 8080:5000 \
  -e DB_USER=devuser \
  -e DB_PASSWORD=devpasswd \
  -e APP_HOSTNAME=local.omatalous.fi \
  -e SENDGRID_USER=bsquared \
  -e SENDGRID_PASSWORD=XXIIdiada \
  -e GIT_UPDATE=$2 \
  --name omatalous-app --link omatalous-pg:pg vhalme/omatalous-app$tag
