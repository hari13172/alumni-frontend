FROM node:20-alpine AS builder

RUN addgroup -S alumni && adduser -S alumni -G alumni

WORKDIR /home/alumni/frontend

COPY . .

RUN npm update -g npm

RUN chown -R alumni:alumni /home/alumni/frontend

USER alumni

RUN npm install --force

RUN npm run build

FROM nginx:alpine AS runner

COPY --from=builder /home/alumni/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
