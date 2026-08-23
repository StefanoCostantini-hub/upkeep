FROM node:20-alpine
WORKDIR /app
COPY server.js .
COPY maintenance-tracker.html .
EXPOSE 8080
CMD ["node", "server.js"]
