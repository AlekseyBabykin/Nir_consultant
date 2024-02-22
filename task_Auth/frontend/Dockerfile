FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm"]
CMD ["start"]
