FROM nginx:latest

# Install netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

# Copy built frontend to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
