# 멀티 스테이지 빌드를 사용하여 최적화된 이미지 생성
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 pnpm-lock.yaml 복사
COPY package.json pnpm-lock.yaml ./

# pnpm 설치 및 의존성 설치
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN pnpm run build

# 프로덕션 스테이지
FROM nginx:alpine

# 빌드된 파일을 nginx 웹 서버로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx 설정 파일 복사 (SPA 라우팅 지원)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 80 노출
EXPOSE 80

# nginx 시작
CMD ["nginx", "-g", "daemon off;"]

