FROM nginx:alpine
# root@MSI:~# ssh-keygen -t rsa -b 4096
# root@MSI:~# ssh-copy-id root@195.201.167.74
# root@MSI:~# ssh root@195.201.167.74
## docker context create remote-server --docker "host=ssh://root@195.201.167.74"
## docker context create remote-produc --docker "host=ssh://root@195.201.167.84"

## docker context use remote-server
## docker-compose up --build -d

# Remove default nginx web files
RUN rm -rf /usr/share/nginx/html/*

# Copy Flutter build output from host to image
COPY static /usr/share/nginx/html

# Optional: custom nginx config (for Flutter routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
