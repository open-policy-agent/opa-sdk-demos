FROM node:22 AS builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm ci
RUN npm run build

FROM caddy:latest
COPY --from=builder /usr/src/app/build /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
