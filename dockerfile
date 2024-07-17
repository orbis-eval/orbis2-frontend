FROM node:22.4.1
WORKDIR /nuxt-app

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn run build

ENTRYPOINT ["yarn", "start"]
