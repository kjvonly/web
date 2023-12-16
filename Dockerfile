FROM node:20 as build

WORKDIR /usr/src/app
# install packages first to avoid running npm install
# if packages don't change.
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . . 
RUN npm run build

FROM python:3.12.0b4-slim-bullseye

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY --from=build /usr/src/app/build build
COPY server.py .

EXPOSE 5000
CMD [ "gunicorn", "-w", "2", "-b", "0.0.0.0:5000", "server:app" ]

