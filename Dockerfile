FROM node:18-alpine AS build

RUN apk add --no-cache libc6-compat

WORKDIR /sbertube/backend

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi
COPY . .


RUN npm i -g pnpm
RUN pnpm config set registry 'https://registry.npmjs.org/'
RUN pnpm i --no-frozen-lockfile
RUN npm run build


FROM build AS runner

WORKDIR /sbertube/backend

COPY --from=build /sbertube/backend ./node_modules
COPY  . .
RUN pnpm build



EXPOSE 3001:3001
CMD ["node","dist/main.js"]


