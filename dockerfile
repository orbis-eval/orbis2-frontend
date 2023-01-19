FROM node:18-alpine
WORKDIR /nuxt-app

COPY . .
RUN npm ci
RUN npm run build

ENTRYPOINT ["npm", "start"]
