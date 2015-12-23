docker stop omatalous
docker rm omatalous
docker run -d -p 8080:5000 --name omatalous --link pg:pg vhalme/omatalous
