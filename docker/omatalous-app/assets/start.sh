#!/bin/bash
cd /takuu-saatio/omatalous
if [ ! -z "$GIT_UPDATE" ]
then
  git pull
  npm install
fi
npm start
