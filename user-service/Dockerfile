# Use official Node LTS image
FROM node:20-alpine
WORKDIR /app
COPY package.json package.json
RUN npm install --production
COPY . .
ENV PORT=5001
EXPOSE 5001
CMD ["node", "server.js"]
