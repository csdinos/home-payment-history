FROM node:14

EXPOSE 3001
WORKDIR /workspace

COPY ["package.json", "package.json", "/workspace/"]
COPY . .

RUN yarn install --pure-lockfile
RUN yarn build

# todo, remove src, migration etc and do this step on another temp container

RUN echo '#!/bin/sh' > init.sh
RUN echo 'yarn migrate:latest' >> init.sh
RUN echo 'yarn seed:run' >> init.sh
RUN echo 'node --trace-warnings ./build/src/index.js' >> init.sh
RUN cat init.sh
RUN chmod +x init.sh

RUN ls -l

ENTRYPOINT ./init.sh
