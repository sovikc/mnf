# mnf
Sample code for Node.js with TypeScript based on Domain-driven design and Uncle Bob's Clean Architecture

## Domain
To manage an inventory of physical display panels used for advertising in shopping centres, malls, and upmarket department stores. These panels have their physical dimensions and a location within the centre, where they are installed. These panels receive their content continuosly, but are also taken offline for maintenance as and when necessary.

## Naming
1. The top-level directories **ims** and **db** have short meaningful names for devs to refer easily during daily conversations.
2. The modules in the sourcecode have domain-specific names so that the domain vocabulary is well-represented, such as inventory (housing domain entities), management (service to manage inventories of centres, assets etc.).
3. The infrastructure specific names are used to give the reviewers an idea what they can expect in the directories, like **postgres** would probably be expected to have SQL related files, whereas **routes** might have handler for the routes.

## Code
1. **inventory** - domain entities like Centre, Location, and Asset. A Centre denotes a shopping centre, or a mall. An Asset represents a physical panel located in a certain Location inside the centre. It also has the Repository and ID generation interfaces, Error declaration and factory functions for the entities and validators. 
2. **management** - domain services for managing centres and assets along with their allocation and deallocation.
3. **postgres** - database related code.
4. **id** - code for ID generation.
5. **routes** - route handling, request/response adapter, and user authentication middleware.
6. **controller** - transformation related code for request/response and invocation of services. 
7. **db/pg.sql** - ddl statements for the tables: shopping_centre, location_within_centre, asset, asset_allocation, and change_log.

## Patterns
1. **Dependency Injection** - Used to inject Repository implementation to management services and ID Generator into domain entities
2. **Factory** - Used to create domain entities
3. **Adapter** - Used in router/handler to adapt the services to http request/response

## Tests
1. Jest is used as a testing framework.
2. Entity creation rules in the inventory have beed tested with centre.spec.ts and asset.spec.ts.
3. Application rules in management services are covered by services.spec.ts.

## How to run
1. The code is dockerized and can easily be run with docker-compose
2. The code has following APIs that can be used
```
   POST          /centres
   
   POST          /centres/:id/locations
   
   POST          /assets
   
   PATCH         /assets/:id
   
   POST          /:id/allocate
   
   DELETE        /:id/allocate
```
3. The server will run of port 8080 in the localhost and the request needs 2 headers `auth-token` with value `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrZjg2cm9sNzAwMDF6MTBmYjNveTNwaDUiLCJpYXQiOjE2MDA1OTY3MTB9.bbGI82--q4U9WIdn4KhAHuVlK4XpkG0moKm6lUPWEww` and `content-type`with value `application/json`

