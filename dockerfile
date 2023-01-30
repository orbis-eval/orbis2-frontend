FROM node:18-alpine
WORKDIR /nuxt-app

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn run build

ENTRYPOINT ["yarn", "start"]
