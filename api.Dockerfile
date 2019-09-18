FROM node:10

COPY server /app

WORKDIR /app

RUN npm install sqlite3

EXPOSE 80

CMD ["node", "."]
