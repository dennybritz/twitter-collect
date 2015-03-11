FROM dockerfile/nodejs

COPY . /app

WORKDIR /app

RUN \
  rm -rf node_modules .env log && \
  npm install

CMD ["npm", "start"]