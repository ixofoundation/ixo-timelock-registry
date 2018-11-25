# build environment
FROM node:latest as builder
RUN mkdir /usr/src/ixotimelockdapp
WORKDIR /usr/src/ixotimelockdapp
ENV PATH /usr/src/ixotimelockdapp/node_modules/.bin:$PATH
COPY package.json /usr/src/ixotimelockdapp/package.json
COPY build /usr/src/ixotimelockdapp/build

RUN npm install --silent
COPY . /usr/src/ixotimelockdapp
RUN npm run build

# production environment
FROM nginx:stable
RUN rm -rf /etc/nginx/conf.d
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/ixotimelockdapp/build/ /var/www
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]