
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# This is the updated line - it only runs install if package.json exists
RUN if [ -f package.json ]; then npm install; fi

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]