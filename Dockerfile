FROM node:18-alpine AS build

RUN apk add --no-cache libc6-compat

WORKDIR /sbertube/backend

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY . .


RUN npm i -g pnpm
RUN pnpm config set registry 'https://registry.npmjs.org/'
RUN pnpm i --no-frozen-lockfile
RUN npm run build


FROM build AS runner

WORKDIR /sbertube/backend

COPY --from=build /sbertube/backend/dist ./backend/dist


EXPOSE 3001:3001
CMD ["node","dist/main.js"]


