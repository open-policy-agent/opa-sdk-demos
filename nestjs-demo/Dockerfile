FROM node:lts-alpine AS builder
USER node
WORKDIR /opt/app
COPY package*.json .
RUN npm ci
COPY --chown=node:node . .
RUN npm run build && npm prune --omit=dev

FROM node:lts-alpine

ENV NODE_ENV production
USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /opt/app/package*.json .
COPY --from=builder --chown=node:node /opt/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /opt/app/dist ./dist

# COPY package*.json .
# COPY node_modules ./node_modules
# COPY dist ./dist
ARG PORT
EXPOSE ${PORT:-3000}

CMD ["node", "dist/main.js"]
