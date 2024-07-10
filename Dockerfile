# ---- Base Node ----
FROM node:16-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
COPY package*.json ./
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY . /app
RUN npm run build

# --- Release ----
FROM node:16-alpine AS release
# Install 'serve' package globally
RUN npm install -g serve
# Copy build output from 'build' stage
COPY --from=build /app/dist /app
# Expose port 5000
EXPOSE 5000
CMD ["serve", "-s", "/app", "-l", "5000"]
