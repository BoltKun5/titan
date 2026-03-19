# build environment
FROM node:16-alpine AS base
RUN npm i -g pnpm

WORKDIR /app
COPY . .

EXPOSE 10100
WORKDIR /app/apps/api-vokit
# Rebuilding sharp package for linux env
RUN npm rebuild --arch=x64 --platform=linuxmusl --libc=glibc sharp
CMD ["pnpm", "--filter vokit-api", "start:prod"]
