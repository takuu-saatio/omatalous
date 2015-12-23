docker stop omatalous
docker rm omatalous
docker run -d -p 8080:5000 --name omatalous --link omatalous-pg:pg vhalme/omatalous
docker logs -f omatalous
