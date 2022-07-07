FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies
RUN npm install -g node-gyp
RUN npm install argon2
RUN npm install
COPY . .
CMD ["npm", "run", "start"]