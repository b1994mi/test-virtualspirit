# test-virtualspirit

This application is hosted on netlify with the `base-url` as below
```
https://fastidious-kleicha-250e2e.netlify.app/api/v1/
```

## Endpoints Documentation

### 👉 Get a list of all tasks

Query params on this endpoint are all optional. If you don't provide `page` & `size` together, then no pagination is used. If you provide `completed` with `true` or `false`, then results will be filtered only with the given `completed` status. If you provide `sort` with `updated-desc`, the results will be sorted by `updatedAt` field. As of right now, only `updated-desc` sorting is available.

```json
GET <base-url>/tasks?page=1&size=5&completed=true&sort=updated-desc

content-type: application/json
response: 200 OK
{
  "data": [
    {
      "id": "2",
      "title": "wah ini judul",
      "description": "nah ada deskripsinya",
      "completed": false,
      "createdAt": "2023-09-22T10:19:24.206Z",
      "updatedAt": "2023-09-22T10:19:24.206Z"
    }
  ],
  "page": 1,
  "size": 1,
  "total": 4
}
```

### 👉 Create a new task

You can only create task with `completed` status of `false` and can later be updated. The `title` and `description` fields are mandatory in request body. The response body will be the task that is created in database.

```json
POST <base-url>/tasks

content-type: application/json
request body:
{
  "title": "The Title",
  "description": "Some description."
}

content-type: application/json
response body: 200 OK
{
  "task": {
    "id": "6",
    "title": "The Title",
    "description": "Some description.",
    "completed": false,
    "updatedAt": "2023-09-23T15:29:28.111Z",
    "createdAt": "2023-09-23T15:29:28.111Z"
  }
}
```

### 👉 Get a specific task by ID

A simple endpoint to get the detail of a specific task by id.

```json
GET <base-url>/tasks/:id

content-type: application/json
response body: 200 OK
{
  "task": {
    "id": "6",
    "title": "Can We Get Another",
    "description": "Wow, I am addicted in adding new tasks",
    "completed": false,
    "updatedAt": "2023-09-23T15:29:28.111Z",
    "createdAt": "2023-09-23T15:29:28.111Z"
  }
}
```

### 👉 Update a task by ID

You can update the `title`, `description`, and `completed` of a task by its `id`.

```json
PUT <base-url>/tasks/:id

content-type: application/json
request body:
{
  "title": "Updated Title",
  "description": "Some other description.",
  "completed": true
}

content-type: application/json
response body: 200 OK
{
    "acknowledge": true
}
```

### 👉 Update a task's completed status by ID

You can also toggle the `completed` status of a task by its `id`. This is a special endpoint that is not stated in the instruction but I created it anyway because a typical front-end developer would need it for a checkbox feature or some sort of it.

```json
PATCH <base-url>/tasks/:id

content-type: application/json
response body: 200 OK
{
    "acknowledge": true
}
```

### 👉 Delete a task by ID

You can also delete a task by using this endpoint.

```json
DELETE <base-url>/tasks/:id

content-type: application/json
response body: 200 OK
{
    "acknowledge": true
}
```

### 👉 Typical Error Response

For any given endpoints, an error response will typically have `error` field in its body. It can be a string or an Object.

```json
DELETE <base-url>/tasks/:id

content-type: application/json
response body: 404 NOT FOUND
{
    "error": "task not found"
}
```

---

## Design Choices

In this section, I will discuss some of the decisions that I took for this application.

- This app is Domain Driven Design (DDD) heavily inspired, so the folder structure will match closely to the routes (or DB table).
- Directory naming follows the Netlify Functions (AWS Lambda) default, so instead if a typical `src` folder, I use `netlify/functions` folder to place all the main code.
- As per instructions, this app is hosted on netlify using netlify function and the DB is PostgreSQL hosted using ElephantSQL.

## Migration & Sequelize

- I use manual migration because there is only one table that is needed, if this was a real application I would use migration tool such as `sql-migrations` to track which files that have been migrated.
- I use sequelize as it is the ORM that I'm already familiar with.
- I use as little DB pooling as possible because I'm not sure how every "function" call will spawn a "pod" or not as this is serverless (unlike deploying directly using kubernetes) and might cause too much connections to the DB.

## Dependency Injection & Unit Testing

- Dependency Injection (DI) is used so that I can easily "inject" any dependencies (like DB connection) when writing unit test
- Using DI makes tests more "stateless" as they are not in need of an actual db connection.
- Sometimes, we need to test using a real db connection locally (see the section below for the reason). This is why I have prepared some skipped tests that should only be used locally and not to be used by test suite such as SonarQube on deployment build step.
- Prerequisite to running the tests are Node v18 because I use the built-in node test runner. I specifically chose this because I don't want to add another package/dependency installed on this app as I like minimalist apps.
- We can use command `npm run test` for running the test and knowing the coverage of those tests locally.
- Some day we can use reporting tool such as `nyc/c8` to create lcov file for SonarQube to consume.

## Running It Locally

To run this app locally, you need to do some of the steps below. This is due to the app is deployed on Netlify Functions and can not be started like a typical express app.

1) You need to install the needed packages.

```sh
npm install netlify-lambda pg-hstore
```

2) Add this two lines of code in `netlify.toml` file. This is to specify where the "bundled" `api.js` will be stored temporarily. The `dist` folder is git ignored, so it won't be pushed to the repo.

```toml
[build]
  functions = "dist"
```

3) Add this two lines of code in `netlify/functions/model/index.js`. This is due to the sequelize instantiation that happens only when a function is called and not when the app starts.

```js
const dotenv = require('dotenv')
dotenv.config()
```

I specifically did not install these packages and add those lines of code as it might intervene with default Netlify Functions setting. Just installing the `netlify-lambda` it self gives a warning of "5 high severity vulnerabilities".

You might ask, how on earth did you test you code? Well, that is where those local-only unit tests that connects to a real DB comes in to help. Despite all that unit testing, I still tried out using the method above to run the app locally but just did not push the changes to the repo.
