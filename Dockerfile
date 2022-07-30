FROM node:16.16.0

COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build --production

RUN npm install -g serve
CMD serve -s build
EXPOSE 3000
