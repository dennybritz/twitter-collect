FROM debian:wheezy

RUN \
  apt-get update && \
  apt-get install -y build-essential curl wget && \
  curl https://raw.githubusercontent.com/creationix/nvm/v0.24.0/install.sh | bash && \
  /bin/bash -c "nvm install stable && nvm use stable"

COPY . /app

WORKDIR /app

ENTRYPOINT ["/bin/bash"]

CMD ["npm start"]