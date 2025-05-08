frontend: npm start
backend: npm run dev
        docker run -d --name redis -p 6379:6379 redis
        docker exec -it redis redis-cli
backend: The next time run :
        docker ps -a 
        docker start redis
        docker exec -it redis redis-cli
        npm run dev (new terminal)