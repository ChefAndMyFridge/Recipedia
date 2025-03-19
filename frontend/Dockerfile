# 빌드 단계
FROM node:20-alpine as builder
RUN corepack enable
RUN corepack prepare yarn@4.6.0 --activate
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# 서빙 단계
FROM nginx:stable-alpine
# root 권한으로 실행
USER root
# Nginx 관련 디렉토리 강제 생성
RUN mkdir -p /usr/share/nginx/html /etc/nginx/conf.d
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV TZ=Asia/Seoul
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN echo "Asia/Seoul" > /etc/timezone
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]