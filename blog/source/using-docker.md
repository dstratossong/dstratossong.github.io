Using Docker
============

_September 17th, 2015_

---------


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
This file is quite straight forward: we use the Ubuntu-based image, and update it; we make our application directory from root, and make it our working directory. Making the folder our working directory means that any command which we inject inside the container will run here. We then add the Gemfile and install all the bundles. Docker caches this into a new container, and then we add the rest of the application files to the container. Note that Docker cannot cache the `ADD` command, so we try to leave it as late as possible.

A bug that I had before is that my local Gemfile.lock is not synchronized with the most current Gemfile dependencies. As a result, when a different Gemfile.lock is added to the container, it looks for gem versions that were not previously installed (with only the Gemfile). This causes problems and to fix them, simply ignore the lock: 
```
# .dockerignore
Gemfile.lock
```

Next, we want to configure our compose file. Here, I used a common.yml file as a base, which we will reuse later when creating a different compose file for production. 
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

Already, we can start building the application:
```
docker-compose build                     # build
```

So what exactly does `docker-compose build` do? Note that we defined a `build` command in common.yml, which simply points to the current directory. Every other command is configured for running the container. Thus `docker-compose build` simply translates to `docker build .`, which runs the commands in the Dockerfile found in the current directory. You will see that Docker first skips the building of the db because it is simply an image (it will be built when ran). Then, Docker follows every instruction in the Dockerfile. 

Before running this server, we need to change up the database configuration. Postgres's host is no longer localhost but db, so we need to configure it that way. To make this application still runnable with traditional methods, we will put it as an environment variable (we set its value inside docker-compose.yml)

```
# database.yml
development: &default
  adapter: postgresql
  encoding: unicode
  pool: 5
  host: <%= ENV['DATABASE_HOST'] || "localhost" %>
  port: 5432

  database: conjure_development
  username: postgres
  password:

test:
  <<: *default
  database: conjure_test

production:
  <<: *default
  database: conjure_production
  username: postgres
  password: <%= ENV['DATABASE_PASSWORD'] %>

```
Now we can run (and stop) the application. 

```
docker-compose up -d                     # start (daemon)
docker-compose logs                      # view output
docker-compose stop                      # stop daemons
```
Rails might throw an exception and kill itself when you attempt this, and it might be because the database is not created. Then simply create it by running commands inside the container:
```
docker-compose run INSTANCE COMMAND      # running commands
docker-compose run web rake db:create    # e.g. create database
docker-compose run web rake db:migrate   # e.g. migrate database
docker-compose run web rake db:seed      # e.g. seeding database
```
If the problem is something like "Gem not found", then remove Gemfile.lock from the local directory. Don't worry, after rebuilding the container, a new lock will be created. 

We might want to connect to the rails console, which is as simple as running a command:
```
docker-compose run web rails console     # e.g. getting console
```

---------

Docker Machine allows us to deploy to a remote server easily. Here I will simply show the commands.
```bash
docker-machine create \
--driver amazonec2 \
--amazonec2-access-key your-aws-access-key \
--amazonec2-secret-key your-aws-secret-key \
--amazonec2-vpc-id your-aws-vpc-id \
--amazonec2-subnet-id your-aws-subnet-id \
--amazonec2-region us-east-1 \
--amazonec2-zone a \
ec2box                                   # creating AWS instance with docker
docker-machine ls                        # listing all instances
eval $(docker-machine env ec2box);       # setting attachment
docker-compose build                     # directly manipulating
                                         # ... and other docker-compose commands
```
