FROM risingstack/alpine:3.3-v4.2.6-1.1.3
MAINTAINER Ragnar B. Johannsson <ragnar@igo.is>

ADD package.json package.json
RUN npm install

ADD . .
CMD ["node","server.js"]
