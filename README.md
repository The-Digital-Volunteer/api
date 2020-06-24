# Express REST API FOR thedigitalvolunteer project
> Express REST API FOR thedigitalvolunteer project with Token auth & mysql backend

## Table of Contents
- [Install & Use](#install-and-use)
- [Entities](#entities)
  - [User Entity Full](#user-entity-full)
  - [User Entity Lite](#user-entity-lite)
  - [Message Entity](#message-entity)
  - [UserRating Entity](#userrating-entity)
  - [HelpRequest Entity](#helprequest-entity)
- [Endpoints](#endpoints)
  - [User methods](#user-methods)
  - [Message methods](#message-methods)
  - [UserRating methods](#userrating-methods)
  - [HelpRequest methods](#helprequest-methods)  

## Install and Use
Download and Install Docker
https://docs.docker.com/get-docker/

Download and Install Docker Compose
https://docs.docker.com/compose/install/


Cloning this repository

```sh
# HTTPS
$ git clone https://github.com/The-Digital-Volunteer/api.git
```

Running MySQL and NodeJS as a service on background
```sh
# cd into project root
cd api
$ cp .env.development .env
$ docker-compose up -d
$ yarn
$ ./node_modules/.bin/sequelize db:create
$ ./node_modules/.bin/sequelize db:migrate
```

## UTILITIES
- `yarn dev` - simply start the server withou a watcher
- `yarn lint` - linting with [eslint](http://eslint.org/)
- `yarn nodemon` - same as `npm start``
- `yarn prepush` - a hook wich runs before pushing to a repository, runs `yarn test`
- `yarn pretest` - runs linting before `yarn test`



## ENTITIES
### User Entity Full
```json
{
    "id": 1,
    "firstName": "Ivan",
    "lastName": "Ugarte",
    "email": "ivan.ugarte.castro@gmail.com",
    "bankId": null,
    "password": "$2a$10$nhc248lbJKzIV9r8YVBTUe0pX3gAIx3JDBlJylFtSBgh5VUpEbAYG",
    "phone": "653666666",
    "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum sem et tellus suscipit, eget laoreet sapien blandit. Phasellus diam turpis, sollicitudin egestas lacus eu, pulvinar porta neque. Nullam tristique massa auctor odio vestibulum, id malesuada arcu fringilla. Vestibulum feugiat lobortis purus, ut venenatis mi accumsan nec. ",
    "avatar": null,
    "token": "$2a$10$WVYD7Zh4nW205NivSxxUKOmqu75wbjLgo4wHttzIsCp1xEwtnABUG",
    "status": 0,
    "role": "helper",
    "skills": [
        "driver",
        "picker",
        "shopper",
        "inmune"
    ],
    "createdAt": "2020-04-26T11:18:26.000Z",
    "updatedAt": "2020-04-26T11:18:26.000Z",
    "address": {
        "street": "Avda Random 125, 3B",
        "postalCode": "28044",
        "city": "Madrid"
    },
    "location": {
        "latitude": 40.381008,
        "longitude": -3.779788
    },
    "rating": {
        "total": 2,
        "average": 7.5
    }
}
```
### User Entity Lite
```json
{
    "id": 3,
    "firstName": "Ivan3",
    "lastName": "Ugarte",
    "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum sem et tellus suscipit, eget laoreet sapien blandit. Phasellus diam turpis, sollicitudin egestas lacus eu, pulvinar porta neque. Nullam tristique massa auctor odio vestibulum, id malesuada arcu fringilla. Vestibulum feugiat lobortis purus, ut venenatis mi accumsan nec. ",
    "avatar": null,
    "rating": {
        "total": 7,
        "average": 8.285714285714286
    }
}
```

### Message Entity
```json
{
    "id": 1,
    "fromUser": {
        "id": 3,
        "firstName": "Ivan3",
        "lastName": "Ugarte",
        "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum sem et tellus suscipit, eget laoreet sapien blandit. Phasellus diam turpis, sollicitudin egestas lacus eu, pulvinar porta neque. Nullam tristique massa auctor odio vestibulum, id malesuada arcu fringilla. Vestibulum feugiat lobortis purus, ut venenatis mi accumsan nec. ",
        "avatar": null,
        "rating": {
            "total": 7,
            "average": 8.285714285714286
        }
    },
    "toUser": {
        "id": 1,
        "firstName": "Ivan",
        "lastName": "Ugarte",
        "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum sem et tellus suscipit, eget laoreet sapien blandit. Phasellus diam turpis, sollicitudin egestas lacus eu, pulvinar porta neque. Nullam tristique massa auctor odio vestibulum, id malesuada arcu fringilla. Vestibulum feugiat lobortis purus, ut venenatis mi accumsan nec. ",
        "avatar": null,
        "rating": {
            "total": 2,
            "average": 7.5
        }
    },
    "helpRequest": null,
    "title": "i am a title",
    "content": "thx for all folks",
    "createdAt": "2020-04-26T10:18:34.000Z",
    "updatedAt": "2020-04-26T10:18:34.000Z"
}
```

### UserRating Entity
```json
{
        "id": 8,
        "fromUser": {
            "id": 3,
            "firstName": "Ivan3",
            "lastName": "Ugarte",
            "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum sem et tellus suscipit, eget laoreet sapien blandit. Phasellus diam turpis, sollicitudin egestas lacus eu, pulvinar porta neque. Nullam tristique massa auctor odio vestibulum, id malesuada arcu fringilla. Vestibulum feugiat lobortis purus, ut venenatis mi accumsan nec. ",
            "avatar": null,
            "rating": {
                "total": 7,
                "average": 8.285714285714286
            }
        },
        "toUser": {
            "id": 1,
            "firstName": "Ivan",
            "lastName": "Ugarte",
            "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum sem et tellus suscipit, eget laoreet sapien blandit. Phasellus diam turpis, sollicitudin egestas lacus eu, pulvinar porta neque. Nullam tristique massa auctor odio vestibulum, id malesuada arcu fringilla. Vestibulum feugiat lobortis purus, ut venenatis mi accumsan nec. ",
            "avatar": null,
            "rating": {
                "total": 2,
                "average": 7.5
            }
        },
        "value": 5,
        "comment": "Lore lore macu macu",
        "createdAt": "2020-04-26T09:20:49.000Z",
        "updatedAt": "2020-04-26T09:20:49.000Z"
    }
```

### HelpRequest Entity
```json
{
    "id": 2,
    "fromUser": {
        "id": 2,
        "firstName": "Ivan2",
        "lastName": "Ugarte",
        "phone": "653666666",
        "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum sem et tellus suscipit, eget laoreet sapien blandit. Phasellus diam turpis, sollicitudin egestas lacus eu, pulvinar porta neque. Nullam tristique massa auctor odio vestibulum, id malesuada arcu fringilla. Vestibulum feugiat lobortis purus, ut venenatis mi accumsan nec. ",
        "avatar": null,
        "address": {
            "street": "Avda Random 125, 3B",
            "postalCode": "28044",
            "city": "Madrid"
        },
        "rating": {
            "total": 0,
            "average": 0
        }
    },
    "assignedUser": null,
    "description": "Need some pork meat, 1 dozen eggs, 4 milk bottles, gouda",
    "priority": 1,
    "status": 0,
    "helpType": "other",
    "timeOptions": [
        "10:00-11:00",
        "12:00-13:00"
    ],
    "deliveryOption": "door",
    "paymentOption": "cash",
    "createdAt": "2020-04-26T12:41:46.000Z",
    "updatedAt": "2020-04-26T14:07:51.000Z",
    "location": {
        "latitude": 40.382507,
        "longitude": -3.778288
    }
}
```

## ENDPOINTS
All methods marked as [auth] in the [routes structure](https://github.com/The-Digital-Volunteer/api/blob/master/config/routes/publicRoutes.js#L3) must include a X-Auth-Token Header with the token that is returned in the POST /user or POST /user/auth methods or it will return a 401 Unauthorized error

You can check the postman collection for examples
https://www.getpostman.com/collections/32f60ce3b96144952ddd

### USER METHODS
#### POST /user
> Body
```json
{
	"firstName": "Ivan3",
	"lastName": "Ugarte",
	"bankId": "ivan.ugarte.castro3@gmail.com",
	"password": "harris00",
	"phone": "653666666",
	"address": {
		"street": "Avda Random 125, 3B",
		"postalCode": "28044",
		"city": "Madrid"
	},
	"location": {
		"latitude": 40.3825075,
		"longitude": -3.7782882		
	},
	"skills": "driver|picker|shopper",
	"role": "helper",
	"status": 0,
	"about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum sem et tellus suscipit, eget laoreet sapien blandit. Phasellus diam turpis, sollicitudin egestas lacus eu, pulvinar porta neque. Nullam tristique massa auctor odio vestibulum, id malesuada arcu fringilla. Vestibulum feugiat lobortis purus, ut venenatis mi accumsan nec. "
}
```
> Output
```json
{
	FULL USER ENTITY,
	...
	"token": "38423484328947412384723483247328934adfafafafaf"
}
```
> Error codes
- 402 bankId or email already created
- 500 db error

#### POST /user/auth
> Body
```json
{
	"email": "ivan.ugarte.castro@gmail.com",
	"password": "hsfsdfsdjsdfkajsfsdf"
}
```
> Output
```json
{
	FULL USER ENTITY,
	...
	"token": "38423484328947412384723483247328934adfafafafaf"
}
```
> Error codes
- 403 forbidden
- 500 db error

#### GET /user/:id
> Output
```json
{
	FULL USER ENTITY OR LITE USER ENTITY BASED ON X-Auth-Token
}
```
> Error codes
- 404 user not found
- 500 db error

#### PUT /user/:id
> Body
```json
{
	"firstName": "Ivan3",
	"lastName": "Ugarte",
	"bankId": "ivan.ugarte.castro3@gmail.com",
	"password": "harris00",
	"phone": "653666666",
	"address": {
		"street": "Avda Random 125, 3B",
		"postalCode": "28044",
		"city": "Madrid"
	},
	"location": {
		"latitude": 40.3825075,
		"longitude": -3.7782882		
	},
	"skills": "driver|picker|shopper",
	"role": "helper",
	"status": 0,
	"about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum sem et tellus suscipit, eget laoreet sapien blandit. Phasellus diam turpis, sollicitudin egestas lacus eu, pulvinar porta neque. Nullam tristique massa auctor odio vestibulum, id malesuada arcu fringilla. Vestibulum feugiat lobortis purus, ut venenatis mi accumsan nec. "
}
```
> Output
```json
{
	FULL USER ENTITY,
}
```
> Error codes
- 401 unauthorized
- 404 user not found
- 500 db error

#### DELETE /user/:id
> Body
```json
{
	"onlyDisable": boolean -> it indicates if the user must be flagged as disabled (no login, no actions can be made) or fully deleted from the db (including all messages, request and whatever related to the user)
}
```
> Output
```json
{
	"id": int // passthrough of the :id
}
```
> Error codes
- 401 unauthorized
- 404 user not found
- 500 db error

#### POST /user/:id/logout
Output
```json
{
	"id": int // passthrough of the :id
}
```
Error codes
- 401 unauthorized
- 404 user not found
- 500 db error




### MESSAGE METHODS
#### POST /message
> Body
```json
{
	"fromUser": 1,
	"toUser": 3,
	"title": "i am a title4",
	"content": "thx for all folks4"
}
```
> Output
```json
{
	MESSAGE ENTITY
}
```
> Error codes
- 401 unauthorized
- 500 db error

#### GET /message/:id
> Output
```json
{
	MESSAGE ENTITY
}
```
> Error codes
- 401 unauthorized
- 404 forbidden
- 404 Message not found
- 500 db error

#### DELETE /message/:id
> Output
```json
{
	id: int, // Passthough of the *ID*
}
```
> Error codes
- 401 unauthorized
- 404 forbidden
- 404 Message not found
- 500 db error


#### GET /user/:id/messages/sent
> Output
```json
[
	MESSAGE ENTITY, MESSAGE ENTITY, ...
]
```
> Error codes
- 401 unauthorized
- 404 forbidden
- 404 user not found
- 500 db error

#### GET /user/:id/messages/received
> Output
```json
[
	MESSAGE ENTITY, MESSAGE ENTITY, ...
]
```
> Error codes
- 401 unauthorized
- 404 forbidden
- 404 user not found
- 500 db error


### USER RATING METHODS
#### POST /rating
> Body
```json
{
	"fromUser": 3,
	"toUser": 1,
	"value": 10,
	"comment": "Lore lore macu macu"
}
```
> Output
```json
{
	USER RATING ENTITY
}
```
> Error codes
- 401 unauthorized
- 500 db error

#### GET /user/:id/ratings/received
Get the ratings that the user has received
> Output
```json
[
	USERRATING ENTITY, USERRATING ENTITY, ...
]
```
> Error codes
- 401 unauthorized
- 404 forbidden
- 404 User not found
- 500 db error

#### GET /user/:id/ratings/created
Get the ratings that the user has done
> Output
```json
[
	USERRATING ENTITY, USERRATING ENTITY, ...
]
```
> Error codes
- 401 unauthorized
- 404 forbidden
- 404 User not found
- 500 db error

#### GET /user/:id/ratings/pending
Get the users of completed help requests that the given user has started or attended, but that have not yet received a rating.
> Output
```json
{
  helpers: [ USER ENTITY, USER ENTITY, ... ],
  inneeds: [ USER ENTITY, USER ENTITY, ... ]
}
```
> Error codes
- 401 unauthorized
- 404 forbidden
- 404 User not found
- 500 db error


### HELP REQUEST METHODS
#### POST /help-request
> Body
```json
{
	"fromUser": 2,
	"description": "Need some pork meat, 1 dozen eggs, 6 milk bottles",
	"location": {
		"latitude": 40.3825075,
		"longitude": -3.7782882		
	},
	"helpType": "groceries",
	"deliveryOption": "door",
	"paymentOption": "cash",
	"timeOptions": ["10:00-11:00","12:00-13:00","19:00-20:00","20:00-21:00"]
}
```
> Output
```json
{
	HELP REQUEST ENTITY
}
```
> Error codes
- 401 unauthorized
- 500 db error

#### POST /help-request/search/inneed
> Output
```json
[
	HELP REQUEST ENTITY, HELP REQUEST ENTITY, ...
]
```
> Error codes
- 500 db error

#### POST /help-request/search/helper
> Output
```json
[
	HELP REQUEST ENTITY, HELP REQUEST ENTITY, ...
]
```
> Error codes
- 500 db error


#### GET /help-request/:id
> Output
```json
{
	HELP REQUEST ENTITY
}
```
> Error codes
- 404 help request not found
- 500 db error

#### PUT /help-request/:id
> Body (whatever field in the Help Request Entity)
```json
{
	"description": "Need some pork meat, 1 dozen eggs, 4 milk bottles, gouda",
	"location": {
		"latitude": 40.3825075,
		"longitude": -3.7782882		
	},
	"helpType": "groceries",
	"deliveryOption": "door",
	"paymentOption": "cash",
	"timeOptions": ["10:00-11:00","12:00-13:00"]
}
```
> Output
```json
{
	HELP REQUEST ENTITY
}
```
> Error codes
- 404 help request not found
- 500 db error

#### DELETE /help-request/:id
> Output
```json
{
	"id": ":id"
}
```
> Error codes
- 404 help request not found
- 500 db error

#### POST /help-request/:id/assign
> Body
```json
{
	"userId": 1
}
```
> Output
```json
{
	HELP REQUEST ENTITY
}
```
> Error codes
- 404 help request not found
- 500 db error

#### POST /help-request/:id/accept
> Output
```json
{
	HELP REQUEST ENTITY
}
```
> Error codes
- 404 help request not found
- 500 db error

#### POST /help-request/:id/done
> Output
```json
{
	HELP REQUEST ENTITY
}
```
> Error codes
- 404 help request not found
- 500 db error
