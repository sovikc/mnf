FROM node:alpine
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./.npmrc ./.npmrc
RUN npm install
RUN npm run-script build
CMD ["npm", "start"]