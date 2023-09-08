# SberTube (API)
![](logo-readme.svg)

## The Smallest and powerful API for new generation video service for creators.


# Methods
1. Auth - Authorization 
   1. [Register](#register)
   2. [Login](#login)
2. User - User manipulation methods
   1. [Edit User](#edit-user)
   2. [Delete User](#delete-user)
3. video


# Auth
## The methods which dedicated to authorizing and registering user

# Register


> Type: POST
## This method accept user to register
```http request
    api/auth/login
```
> Incoming parameters:

| # | naming        | type   | specs                   |
|---|---------------|--------|-------------------------|
| 1 | email         | string | your email              |
| 2 | username      | string | your username           |
| 3 | password      | string | your password           |
| 4 | checkPassword | string | repeat of your password |

## Example
```javascript
    const req = await fetch('api/auth/login', { 
      body: 
        {
          email: "123@mail.ru", 
          username:"test",
          password: "123",
          checkPassword: "123" 
        },
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    const resp = req.json()
```
>Returned object
``` JSON
 "user": {
        "email": "1234@mail.ru",
        "username": "username1214",
        "password": "$2b$10$Udz3ULZG1PMvQeyDxpy3R.ULQIXbFqfBmay/bzWLSbz8YJvD2qbWK",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEyMzRAbWFpbC5ydSIsInVzZXJuYW1lIjoidXNlcm5hbWUxMjE0IiwicGFzc3dvcmQiOiIxMjMiLCJjaGVja1Bhc3N3b3JkIjoiMTIzIiwiaWF0IjoxNjk0MTkyOTQxfQ.WXIFkLwWcjJ9pOpvqCCax6RUkui6n03YJVE1dl9BwMc",
        "videos": []
    }
````

# Login

> Type: POST
## This method accept user to register
```http request
    api/auth/login
```
> Incoming parameters:

| # | naming        | type   | specs                   |
|---|---------------|--------|-------------------------|
| 1 | username      | string | your username           |
| 2 | password      | string | your password           |

> Returned object
## Example
```javascript
    const req = await fetch('api/auth/login', { 
      body: 
        {
          username:"test",
          password: "123",
        },
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    const resp = req.json()
```
``` JSON
 "user": {
        "email": "1234@mail.ru",
        "username": "username1214",
        "password": "$2b$10$Udz3ULZG1PMvQeyDxpy3R.ULQIXbFqfBmay/bzWLSbz8YJvD2qbWK",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEyMzRAbWFpbC5ydSIsInVzZXJuYW1lIjoidXNlcm5hbWUxMjE0IiwicGFzc3dvcmQiOiIxMjMiLCJjaGVja1Bhc3N3b3JkIjoiMTIzIiwiaWF0IjoxNjk0MTkyOTQxfQ.WXIFkLwWcjJ9pOpvqCCax6RUkui6n03YJVE1dl9BwMc",
        "videos": []
    }
````

# User Methods
# Edit User
> **Required**
> Needs Authorization

> Type: Put
> api/auth/login

| # | naming   | type   | specs         |
|---|----------|--------|---------------|
| 1 | email    | string | your email    |
| 1 | username | string | your username |
| 2 | password | string | your password |

> **Note**
> Email not editable field
> These method will edit your data on datatbase




> Returned object
## Example
```javascript
    const req = await fetch('api/user', { 
      body: 
        {
          email: "123@mail.ru",
          username:"test123",
          password: "123",
        },
      method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    const resp = req.json()
```
``` JSON
 "user": {
        "email": "1234@mail.ru",
        "username": "test123",
        "password": "$2b$10$Udz3ULZG1PMvQeyDxpy3R.ULQIXbFqfBmay/bzWLSbz8YJvD2qbWK",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEyMzRAbWFpbC5ydSIsInVzZXJuYW1lIjoidXNlcm5hbWUxMjE0IiwicGFzc3dvcmQiOiIxMjMiLCJjaGVja1Bhc3N3b3JkIjoiMTIzIiwiaWF0IjoxNjk0MTkyOTQxfQ.WXIFkLwWcjJ9pOpvqCCax6RUkui6n03YJVE1dl9BwMc",
        "videos": []
    }
```

# Delete User
> **Required**
> Needs Authorization

> Type: Delete
> api/auth/login

| # | naming   | type   | specs         |
|---|----------|--------|---------------|
| 1 | username | string | your username |


> **Note**
> This method will delete your user from database




> Not Return Value
## Example
```javascript
    const req = await fetch('api/user', { 
      body: 
        {
         
          username:"test123",
        },
      method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

```
