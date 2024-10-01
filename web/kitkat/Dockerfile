# syntax = docker/dockerfile:1.2

FROM node:22-alpine3.20 as base 

RUN apk update && \
    apk add libc6-compat && \
    apk add make gcc g++ python3

RUN yarn global add turbo

FROM base as deps

WORKDIR /usr/src/app

COPY . .

RUN turbo prune kitkat --docker

FROM base as builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/out/json/ .
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

COPY --from=deps /usr/src/app/out/full/ .
RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env cat /etc/secrets/.env > ./web/kitkat/.env
RUN yarn turbo run build --filter=kitkat

FROM base as runner 

WORKDIR /usr/src/app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs  /usr/src/app/web/kitkat/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs  /usr/src/app/web/kitkat/.next/static ./web/kitkat/.next/static

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD  node web/kitkat/server.js