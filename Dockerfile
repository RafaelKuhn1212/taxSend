# Build stage
FROM node:18.18.2-alpine3.18 as build

WORKDIR /app

# Copying package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm
RUN apk add g++ make py3-pip
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake
# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build
RUN pnpm prisma generate
CMD ["pnpm", "start"]
