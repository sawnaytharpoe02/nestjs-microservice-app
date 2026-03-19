FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/notifications/package.json apps/notifications/package.json

COPY apps/notifications apps/notifications
COPY libs libs

RUN npm install --legacy-peer-deps

RUN cd apps/notifications && npm install --legacy-peer-deps

RUN npm run build notifications

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/notifications/package.json apps/notifications/package.json

RUN npm install --prod --legacy-peer-deps

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/notifications/main" ]
