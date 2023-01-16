FROM node:19

WORKDIR /nuxt-app

COPY . .
RUN npm ci
RUN npm run build

ENV PORT=63013

EXPOSE $PORT

ENTRYPOINT ["npm", "start"]
