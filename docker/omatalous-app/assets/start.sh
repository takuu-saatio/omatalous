#!/bin/bash
cd /takuu-saatio/omatalous
if [ ! -z "$GIT_UPDATE" ]
then
  if [ ! -z "$GIT_SHA1" ]
  then
    git reset --hard $GIT_SHA1
  else
    git pull
  fi
  npm install
fi
npm start -- --release
