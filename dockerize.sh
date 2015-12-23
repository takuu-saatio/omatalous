#!/bin/bash
cd docker/postgresql
docker create -v /var/lib/postgresql/data --name omatalous-data busybox
docker build -t vhalme/omatalous-pg .
docker run -d -P --volumes-from omatalous-data --name omatalous-pg vhalme/omatalous-pg
cd ../app
docker build -t vhalme/omatalous .
docker run -d -p 8080:5000 --name omatalous --link omatalous-pg:pg vhalme/omatalous
cd ../../
