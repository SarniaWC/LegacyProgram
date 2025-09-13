# Stage 1: Build the Next.js app
FROM node:22-alpine AS builder

WORKDIR /app

# Declare build-time variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MAIN_SITE
ARG NEXT_PUBLIC_SITE_URL

# Inject them into the build environment
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MAIN_SITE=$NEXT_PUBLIC_MAIN_SITE
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy source files and build
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
