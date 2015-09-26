Using Docker
============

Docker is a container service that encapsulates microservices automates deployment of applications. If unfamiliar with containers, think of them as virtual machines (VMs) that only provide operating system level virtualization (on top of kernel), but unlike VMs, this does not extend to hardware level. At first look, it is a light-weight version of virtual machines. This greatly supports the microservices pattern, which encourages the splitting of a large application into services that communicate through TCP, APIs or a message queue (MQ). Docker also provides a Makefile-like deployment script (called Dockerfile), and its main development is towards clustering containers and optimizing their communication between each other.

We looked towards Docker when we thought of building our own infrastructure on AWS and moved away from Heroku. To dockerize our application, we had to use Docker Compose, previously fig, a tool that as of this writing is not production-ready.

The ideal setup for Docker is to have a single command to build your entire project, and another to start the server. There should be abilities to manipulate the container to run commands, like seeding the database (which shouldn't be ran every time you deploy!). Additionally, the commands should be the same for deploying remotely. 

We will setup the obvious infrastructure by putting the database in a container and the Rails application in another. We will link them so that they can communicate to each other (and taking advantage that Postgres can be accessed over a TCP port). We will see that the host will not be `localhost`. The linking is where Docker Compose comes in, which implements an almost recursive building process.

To start off, we write a Dockerfile that takes a base image to start from. There are various arguments online suggesting that Ubuntu-based images are not meant to use with Docker. Because many applications are still in the process of adapting to Docker, we encourage you to find your own fit and balance between familiarity and configuration. For reference, see [baseimage-docker](http://phusion.github.io/baseimage-docker/), its [rationale](https://blog.phusion.nl/2015/01/20/baseimage-docker-fat-containers-treating-containers-vms/), [controversy](https://news.ycombinator.com/item?id=7950326) and [alternative](http://blog.tutum.co/2014/12/02/docker-and-s6-my-new-favorite-process-supervisor/).

We will be using the basic Ruby base image, which is based on Ubuntu (with Debian repository). We also want Docker to cache any updates and gem installations, so we put them all in the build process (not the run process later).
```
# Dockerfile
# Base Image
FROM ruby:2.1.5
MAINTAINER Conjure Team <contact@conjureproject.com>

# Update Environment
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev

# Build
RUN mkdir /Conjure
WORKDIR /Conjure

# Install Gem Dependencies
ADD Gemfile /Conjure/Gemfile
RUN bundle install

# Add Files
ADD . /Conjure
```
Note that Docker cannot cache the `ADD` command, so it is the last command. 

```
# database.yml

development: &default
  adapter: postgresql
  encoding: unicode
  pool: 5
  host: <%= ENV['DATABASE_HOST] || "localhost" %>
  port: 5432

  database: connextor_development
  username: postgres
  password:

test:
  <<: *default
  database: connextor_test

production:
  <<: *default
  database: connextor_production
  username: postgres
  password: <%= ENV['MYAPP_DATABASE_PASSWORD'] %>

```

```
# .dockerignore
Gemfile.lock
```

```
# common.yml
postgres:
  image: postgres
web: 
  build: .
  command: bundle exec rails server -p 3000 -b '0.0.0.0' 
  ports: 
    - "3000:3000"
```

```
# docker-compose.yml
db:
  extends:
    file: common.yml
    service: postgres
web:
  environment:
    RAILS_ENV: development
    DATABASE_HOST: db
  extends:
    file: common.yml
    service: web
  volumes:
    - .:/Conjure
  links:
    - db
```

```
# production.yml
db:
  extends:
    file: common.yml
    service: postgres
web:
  environment:
    RAILS_ENV: production
    RACK_ENV: production
    DATABASE_HOST: db
  extends:
    file: common.yml
    service: web
  links:
    - db
```
