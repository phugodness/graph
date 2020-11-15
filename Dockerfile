FROM node:lts-alpine
RUN npm install -g nodemon
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
# RUN npm ci --only=production
COPY . .
EXPOSE 3000
# CMD [ "node", "./bin/www" ]
CMD [ "nodemon", "./bin/www" ]
