FROM node:19

WORKDIR /nuxt-app

COPY . .
RUN npm ci
RUN npm run build

ENTRYPOINT ["npm", "start"]
