FROM node:20 as build

WORKDIR /usr/src/app
# install packages first to avoid running npm install
# if packages don't change.
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . . 
RUN npm run build

FROM nginx

COPY --from=build /usr/src/app/build /usr/share/nginx/html
