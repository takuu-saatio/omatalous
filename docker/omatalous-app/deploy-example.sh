#!/bin/bash

tag=""
if [ ! -z "$1" ]
then
  tag=":$1"
fi

./shutdown.sh
docker run -d -p 8080:5000 \
  -e DB_USER=<db_username> \
  -e DB_PASSWORD=<db_password> \
  -e APP_HOSTNAME=local.omatalous.fi \
  -e SENDGRID_USER=<sg_username> \
  -e SENDGRID_PASSWORD=<sg_password> \
  -e GOOGLE_CLIENT_ID=<google_client_id> \
  -e GOOGLE_CLIENT_SECRET=<google_client_secret> \
  -e FB_CLIENT_ID=<google_client_id> \
  -e FB_CLIENT_SECRET=<google_client_secret> \
  -e ADMIN_USER=<admin@user.email> \
  -e GIT_UPDATE=$2 \
  --name omatalous-app --link omatalous-pg:pg vhalme/omatalous-app$tag
