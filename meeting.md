# Auth Flow

<img src='./diagram-export-28-3-2024-13_14_13.png' width='350px' height='350px'>

### Register

Request

```bash
POST http://{{host}}:{{port}}/api/auth/register
Content-Type: application/json

{
    "email": "info@usmedia.nl",
    "password": "HASHME"
}

```

Response

```json
{
    "user": {
        "id": "fd460112-1bf1-4ecb-b1c0-4f946b9477d2",
        "email": "info2@usmedia.nl",
        "emailVerified": false,
        "twoFactorEnabled": false,
        "_links": {
            "self": {
                "href": "http://localhost:3000/api/users/fd460112-1bf1-4ecb-b1c0-4f946b9477d2"
            }
        }
    }
}
```

### Login

Request

```
POST http://{{host}}:{{port}}/api/auth/login
Content-Type: application/json

{
  "_embedded": {
    "user": {
      "id": "c801043b-ab9c-49dc-a896-84ad6024f56a",
      "email": "info@usmedia.nl",
      "emailVerified": false,
      "twoFactorEnabled": false,
      "_links": {
        "self": {
          "href": "http://localhost:3000/api/users/c801043b-ab9c-49dc-a896-84ad6024f56a"
        }
      }
    }
  }
}
```

Response

```json
Set-Cookie: GIZ-COOKIE=s%3A31b7b3f9-9b6f-49c2-b984-9e53a3ead

{
  "success": true
}
```

# API Responses

Entity

```json
{
    "_embedded": {
        "simulation": {
            "id": "8fdaa946-f465-4264-b47a-e6f197b40688",
            "year": "2031",
            "status": "STATUS_OPEN",
            "administrativeCosts": 0,
            "defaultEmployeeTax": 0,
            "defaultEmployerTax": 0,
            "facility": {
                "name": "My facility",
                "countryCode": "FRA",
                "currencyCode": null,
                "product": null,
                "unitOfProduction": null,
                "annualProduction": null,
                "buyerName": null,
                "buyerProportion": null
            },
            "benchmark": {
                "year": null,
                "source": null,
                "locality": null,
                "region": null,
                "currencyCode": null,
                "currencyName": null,
                "localValue": null
            },
            "createdAt": "2024-03-29T10:21:24.756Z",
            "updatedAt": "2024-03-29T10:21:24.756Z",
            "_links": {
                "self": {
                    "href": "http://localhost:3000/api/simulations/8fdaa946-f465-4264-b47a-e6f197b40688"
                },
                "workers": {
                    "href": "http://localhost:3000/api/simulations/8fdaa946-f465-4264-b47a-e6f197b40688/workers"
                }
            }
        }
    },
    "_links": {
        "self": {
            "href": "http://localhost:3000/api/simulations/8fdaa946-f465-4264-b47a-e6f197b40688"
        },
        "workers": {
            "href": "http://localhost:3000/api/simulations/8fdaa946-f465-4264-b47a-e6f197b40688/workers"
        }
    }
}
```

```json
{
    "_embedded": {
        "simulations": []
    },
    "_links": {
        "self": {
            "href": "http://localhost:3000/api/simulations?index=0&size=25"
        },
        "first": {
            "href": "http://localhost:3000/api/simulations?index=0&size=25"
        },
        "last": {
            "href": "http://localhost:3000/api/simulations?index=0&size=25"
        }
    },
    "paging": {
        "index": 0,
        "size": 25,
        "total": 0
    }
}
```

Success

```json
{
    "success": true
}
```

```json
{
    "resetEmailSent": true
}
```

```json
{
    "passwordReset": true
}
```

# Routes

-   App Engine serves single html (lang=en)
-   Angular handles all routing

```
{
    '/': {
        # This redirects to routes below based on browser language
    }
    '/en': {
        '/dashboard',
        ...
    }
    '/es': {
        '/panel',
        ...
    }
}
```

# Angular Query

https://bitbucket.org/usmedia/giz-costing-tool-app/pull-requests/8
