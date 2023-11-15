FROM docker.io/node:21-bullseye-slim

WORKDIR /app
COPY . /app

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
RUN npm install

ENTRYPOINT ["node", "--loader", "ts-node/esm", "--no-warnings", "main.ts"]
