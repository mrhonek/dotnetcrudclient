FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Use nginx to serve the app
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 