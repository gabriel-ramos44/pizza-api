FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "build/server.js" ]