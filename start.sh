#!/bin/bash

# AGIS 플랫폼 실행 스크립트

echo "🚀 AGIS 플랫폼을 시작합니다..."

# Docker와 Docker Compose가 설치되어 있는지 확인
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되어 있지 않습니다. Docker를 먼저 설치해주세요."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose가 설치되어 있지 않습니다. Docker Compose를 먼저 설치해주세요."
    exit 1
fi

# 실행 모드 선택
echo "실행 모드를 선택하세요:"
echo "1) 프로덕션 모드 (포트 3000)"
echo "2) 개발 모드 (포트 3001)"
read -p "선택 (1 또는 2): " mode

case $mode in
    1)
        echo "📦 프로덕션 모드로 시작합니다..."
        docker-compose up --build agis-frontend
        ;;
    2)
        echo "🔧 개발 모드로 시작합니다..."
        docker-compose --profile dev up --build agis-dev
        ;;
    *)
        echo "❌ 잘못된 선택입니다. 1 또는 2를 입력해주세요."
        exit 1
        ;;
esac

