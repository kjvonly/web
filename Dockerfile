FROM node:20 as build

WORKDIR /usr/src/app
COPY . . 
RUN npm install
RUN npm run build


FROM python:3.12.0b4-slim-bullseye

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY --from=build /usr/src/app/build build
COPY server.py .

EXPOSE 5000
CMD [ "gunicorn", "-w", "2", "-b", "0.0.0.0:5000", "server:app" ]

