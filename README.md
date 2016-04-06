# Dockerized Projects API
Users administration micro-service on Node.js.

* [Architecture](#architecture)
* [Technologies](#technologies)
* [Environment Variables](#environment-variables)
* [API](#api)
* [License](#license)

# Architecture
The application is a REST API service with database and messaging service (Bus) dependencies.

# Technologies
* Node.js
* MongoDB/Mongoose
* Express.js
* Passport.js
* Official nsqjs driver for NSQ messaging service

# Environment Variables
The service should be properly configured with following environment variables.

Key | Value | Description
:-- | :-- | :-- 
MONGODB_CONNECTION | mongodb://mongo_host:mongo_port/projects | MongoDB connection string.
TOKEN_ACCESSSECRET | MDdDRDhBOD*** | Access token secret.
NSQD_ADDRESS | bus.yourdomain.com | A hostname or an IP address of the NSQD running instance.
NSQD_PORT | 4150 | A TCP port number of the NSQD running instance to publish events.
PORT | 8080 | Container port.

# API
## DTO
### User Dto
| Param   | Description |
|----------|-------------|
| id     | User ID |
| role | User role  |
| created | Date of user created |
| used | Used storage space  |
| profile | User [Profile](#profile-dto)  |
| memberships | List of [Memberships](#membership-dto) |

### Profile Dto
| Param   | Description |
|----------|-------------|
| name     | User name from profile |
| avatarUrl | Avatar URL |

### Membership Dto
| Param   | Description |
|----------|-------------|
| id     | Membership id |
| provider | Authentication provider  ('vkontakte', 'facebook', 'twitter', 'google', 'email')|
| created | Date of user created |
| used | Used storage space  |
| email | User email |
| name | User name |

## GET /?**{params}**
Gets users.

### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" with **admin** role|

### Query Param
**{params}** - restricted version of OData protocol with one level brackets '(' ')' support. ([OData documentation](http://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html)).

| Param    | Description | Allowed Values| Example | 
|----------|-------------|---------------|---------|
| $filter    |  Filtering | **fields:** name, created, used, provider, email | $filter=created ge '2016-01-26T15:42:19Z' and (provider eq 'vkontakte' or provider eq 'facebook') |
| $orderby    |  Sorting | **fields:** created, used, provider, email | $orderby=provider desc,created asc|
| $top    | Quantity return entities. | 0 < $top <= 100 | $top=30 |
| $skip    | Quantity skip entities. | 0 < $skip <= 100 | $skip=60 |

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                            |
| Body | List of [Project Dto](#user-dto)                                                            |

# License
Source code is under GNU GPL v3 [license](LICENSE).
