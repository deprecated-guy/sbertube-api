FROM node:18-alpine AS build

RUN apk add --no-cache libc6-compat

WORKDIR /sbertube/backend

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

COPY . .

RUN npm i -g pnpm --force
RUN pnpm config set registry 'https://registry.npmjs.org/'
RUN pnpm i --no-frozen-lockfile
RUN pnpm build

COPY . .

FROM node:18-alpine AS runner

WORKDIR /sbertube/backend

COPY --from=build /sbertube/backend/node_modules ./node_modules


COPY --from=build /sbertube/backend/dist ./dist
CMD ls
ENV SECRET_KEY=${SECRET_KEY}
ENV EXPIRES_IN=${EXPIRES_IN}
ENV DB_HOST=${DB_HOST}
ENV DB_NAME=${DB_NAME}
ENV DB_PORT=${DB_PORT}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_USERNAME=${DB_USERNAME}
ENV DROPSCHEMA=${DROPSCHEMA}
ENV SYNCHRONIZE=${SYNCHRONIZE}
ENV MIGRATIONS_RUN=${MIGRATIONS_RUN}

EXPOSE 3001

CMD ["node", "dist/main.js"]
