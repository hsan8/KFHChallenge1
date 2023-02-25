FROM ubuntu:latest

# Install Apache
RUN apt-get update && \
    apt-get install -y apache2

# Copy files to web server
COPY ./* /var/www/html/

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Apache service
CMD ["apache2ctl", "-D", "FOREGROUND"]