FROM node:12 as build

# установка mystem
COPY ./.docker/mystem/mystem-3.1-linux-64bit.tar.gz /mystem.tgz
RUN tar -xzf mystem.tgz

WORKDIR /app

# Установка зависимостей
COPY package*.json tsconfig.json ./
RUN npm install

# Копирование остальных файлов проекта
COPY . .

RUN npm run build

FROM build as development
ENV NODE_ENV development
ENV TS_NODE_TRANSPILE_ONLY true

RUN npm install -g typescript @nestjs/cli

CMD ["npm", "run", "start:dev"]

FROM node:12 as production
ENV NODE_ENV production

WORKDIR /app

# установка только production зависимостей
COPY package*.json tsconfig.json ./
RUN npm install --only=production

COPY . .
COPY --from=build /app/dist ./dist
COPY --from=build /mystem /mystem

# установка entrypoint (применение миграций и сидов)
COPY ./.docker/etc/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod 0755 /usr/local/bin/entrypoint.sh
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]

# Запуск проекта
CMD ["node", "dist/main"]