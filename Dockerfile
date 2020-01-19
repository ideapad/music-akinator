FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/music-akinator /usr/share/nginx/html