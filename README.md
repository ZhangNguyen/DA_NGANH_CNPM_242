frontend: npm start
backend:
-start with redis
# First time:
docker run -d --name redis -p 6379:6379 redis
docker exec -it redis redis-cli

# Next time:
docker start redis
docker exec -it redis redis-cli
-start backend
cd backend
npm install
npm run dev
-connect with adafruit
ngrok http 3000
Copy the new link and past it into Adafruit IO Webhook configuration
