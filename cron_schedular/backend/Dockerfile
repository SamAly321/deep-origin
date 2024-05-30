FROM node:14

WORKDIR /backend

COPY package.json tsconfig.json jest.config.js ./

RUN npm install

COPY ./src ./src

RUN npm run build

CMD ["npm", "start"]
