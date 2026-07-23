# Use Node LTS
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Expose ports (5000 for backend, 5173 for frontends)
EXPOSE 5000 
CMD ["npm", "run", "dev"]