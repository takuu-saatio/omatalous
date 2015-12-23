FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y build-essential python curl git
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
RUN apt-get install -y nodejs
ADD start.sh /tmp/
RUN chmod +x /tmp/start.sh
CMD /tmp/start.sh

