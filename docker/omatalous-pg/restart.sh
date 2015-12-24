docker stop omatalous-pg
docker rm omatalous-pg
docker run -d -P --volumes-from omatalous-data --name omatalous-pg vhalme/omatalous-pg
