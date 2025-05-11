
# SMART GARDEN WEB APP

Dự án web giám sát và điều khiển vườn bằng thiết bị IOT sử dụng React (frontend), Node.js + Express (backend), Redis và webhook từ Adafruit IO qua ngrok.

## Cách chạy dự án

```bash
cd frontend
npm install
npm start
# First time:
docker run -d --name redis -p 6379:6379 redis
docker exec -it redis redis-cli
# Next time:
docker start redis
docker exec -it redis redis-cli
# Run backend 
cd backend
npm install
npm run dev
# Run ngrok
ngrok http 3000
---
Copy and paste link ngrok into adafruit
