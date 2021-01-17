# home-payment-history


## Preparations
1. Run `docker-compose up hph_db` to start the postgres container

## Run it locally
1. To run it locally we first have to migrate the database manually. To do so run `yarn migrate:latest`
2. If you want to have some predefined data already available, run `yarn seed:run` (optional)
3. Run `yarn start` and enjoy!

## Run it compiled through docker
1. Run `docker-compose build` to prepare the service container
2. Run `docker-compose up hph_service` to start the service container
3. Enjoy!

# Test
1. Simply run `yarn test`. Note that jest is silenced by default so if you want `console.log()` to appear you have to change it in the package.json
# Notes 
1. If you ever want to reset the database, you can rollback by running `yarn migrate:rollback`. Note that you have to migrate again to use the service.
2. When using the API, don't forget to add Basic auth