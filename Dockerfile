FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including dev dependencies needed for build
RUN npm install --include=dev

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

# Set environment variable for port
ENV PORT 8080

# Expose port 8080 instead of 80
EXPOSE 8080

# Start Nginx with our custom command to replace port in nginx config
CMD sh -c "sed -i 's/listen 80/listen $PORT/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'" 