FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y build-essential python curl git vim
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN mkdir /takuu-saatio
RUN cd /takuu-saatio && \
  git clone https://github.com/takuu-saatio/omatalous.git && \
  cd omatalous && \
  npm install
ADD assets/start.sh /
CMD /start.sh
