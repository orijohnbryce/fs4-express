# Base image
FROM node:18

# inside docker, working space
WORKDIR /usr/src/app 

COPY package*.json .


RUN npm install 

# copy all our app files into the working space
COPY . .


RUN npm install -g typescript

RUN npm run build

# port
EXPOSE 3030

CMD ["node", "dist/app.js"]