# Orbis2 Frontend 

This is the vuejs frontend application that can be deployed together with the [orbis2 backend](https://github.com/orbis-eval/orbis2-backend). 


## Orbis2 Docker Container 

There is a  [Orbis2 Docker Container](https://github.com/orgs/orbis-eval/packages/container/package/orbis2-frontend) available to run orbis2 from a single container. 

## run the container 

```
docker run --name orbis2-frontend -p 8090:8090 ghcr.io/orbis-eval/orbis2-frontend:latest
```

The password for postgres will be automatically generated while startup and printed to std-out / console. 

After starting, access the orbis2 frontend under http://localhost:8090/


![Orbis2 Frontend](orbis-screenshot.png)


## mount a local directory to persist the postgres-data 

If you want to persist the postgres-data between container-starts, mount a local directory when running the container.

e.g. mount the local directory **/tmp/orbismount**
```
docker run --name orbis2-frontend -p 8090:8090 \
-e PGDATA=/var/lib/postgresql/data/pgdata \
-v /tmp/orbismount:/var/lib/postgresql/data \
ghcr.io/orbis-eval/orbis2-frontend:latest
```

## Data Export / SQL Dump

dump the orbis postgrese database to a sql file:
```
docker exec -i -e PGPASSWORD=[password] orbis2-frontend /bin/bash -c "pg_dump --username postgres orbis" > [path-to-sql-dump-file].sql
```

##  Run Importer directly inside the docker container

run the importer (documented in [orbis2 backend](https://github.com/orbis-eval/orbis2-backend))


list the remote corpora: 
```
docker exec -e PYTHONPATH=/orbis-backend/src orbis2-frontend /orbis-backend/scripts/importer.py list-remote
```
e.g.  import the remote corpus **N3-RSS-500** with run name **N3-RSS-500-version1**:
```
docker exec -e PYTHONPATH=/orbis-backend/src orbis2-frontend /orbis-backend/scripts/importer.py remote N3-RSS-500 N3-RSS-500-version1
```

## Setup

Make sure to install the dependencies:
```bash
# yarn
yarn
```
We use yarn instead of npm, its faster and has better security features. Further, the pinia framework could not be installed properly with npm.
IMPORTANT: don't mix npm and yarn, since this could lead to wrong dependencies.

## Development

Start the development server on http://localhost:3000

```bash
yarn run dev
```

all used icons can be found under https://oh-vue-icons.js.org/

## Production

Build the application for production:

```bash
yarn run build
```

Locally preview production build:

```bash
yarn run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


# Vue Hero Icons
Installed with 
```
yarn add @heroicons/vue
```


