FROM node:10

COPY client /app

WORKDIR /app/growsari-client

RUN npm install -g @vue/cli

EXPOSE 80

CMD ["npm", "run", "serve"]
