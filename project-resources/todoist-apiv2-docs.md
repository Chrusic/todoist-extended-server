[[td_logo-4f2a90df.svg]][1]

# Overview

This is the official documentation for Todoist REST API. Our original API, named [Sync API][8], provides an easy way to deal with full and partial syncs, but it's not so simple for individual calls. Our REST API aims to provide developers a simple way to consume the most basic features of Todoist API.

#### Request and response format

API endpoints accept arguments either as url-encoded values for non-POST requests or as json-encoded objects encoded in POST request body with a `Content-Type: application/json` header.

POST requests may provide an additional `X-Request-Id` HTTP header containing a unique string to ensure modifications apply only once. Requests having the same ID as a previously processed request will be discarded.

This is not required but can be useful for implementation of request retry logic. This header value should not exceed 36 bytes. We will be generating them with `uuidgen` in the shell code examples.

This API relies on standard HTTP response codes to indicate operation result. The table below is a simple reference about the most used status codes:

Status code

Description

200

The request was processed successfully.

204

The request was processed successfully without any data to return.

4xx

The request was processed with an error. The request was invalid and should not be retried unmodified.

5xx

The request failed due to a server error, it's safe to retry later.

All `200 OK` responses have the `Content-type: application/json` and contain a JSON-encoded representation of one or more objects.

# Client SDKs

Our Python and JavaScript SDKs make it simpler to work with Todoist data by reducing the complexity of calling the Todoist APIs.

## Python SDK

View code samples for the Python SDK by switching to the "Python SDK" tab at the top of the right-hand panel. The [getting started][9] section contains some simple examples of setup and usage.

You can find the [Python SDK source code][10] at its Github repository.

The [todoist-api-python][11] package is distributed via PyPI.

**Install the Todoist Python SDK with pip:**

`pip install todoist-api-python`

Note that this differs from our previous Python SDK. The older SDK was related specifically to our Sync API and is now deprecated.

## JavaScript SDK

View code samples for the Javascript SDK by switching to the "JavaScript SDK" tab in the right hand panel. The [getting started][12] section contains some simple examples of setup and usage.

You can find the [JavaScript SDK source code][13] at its Github repository.

The [todoist-api-typescript][14] package is distributed via npm.

**Install the Todoist Javascript SDK via npm:**

`npm install @doist/todoist-api-typescript`

Note: this SDK uses [axios-case-converter][15] to automatically convert between the "snake\_case" identifiers required by the API and the "camelCase" identifiers used by TypeScript. Using "snake\_case" identifiers in your TypeScript code will still work, but it's not recommended, and will trigger a warning message.

# Getting started

In this section we'll show how to perform some common tasks with the REST API using some simple examples.

We show code samples for each scenario using [cURL][16], the Python SDK, and the JavaScript SDK. Use the tabs at the top of the right-hand panel to switch to the examples for each language.

All the requests in the examples require a user token for authentication. You can find your personal token in the [integrations settings view][17] of the Todoist web app and replace the token value in the samples.

## Get a user's projects

&gt; Sending the request:

`$ curl -X GET \   https://api.todoist.com/rest/v2/projects \   -H "Authorization: Bearer 0123456789abcdef0123456789"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     projects = api.get_projects()     print(projects) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getProjects()     .then((projects) =&gt; console.log(projects))     .catch((error) =&gt; console.log(error))`

&gt; An example projects response:

`[     {         "id": "220474322",         "name": "Inbox",         "comment_count": 10,         "order": 0,         "color": "grey",         "is_shared": false,         "is_favorite": false,         "is_inbox_project": true,         "is_team_inbox": false,         "view_style": "list",         "url": "https://todoist.com/showProject?id=220474322",         "parent_id": null,     } ]`

`[     Project(         id: "220474322",         name: "Inbox",         comment_count: 10,         order: 0,         color: "grey",         is_shared: False,         is_favorite: False,         is_inbox_project: True,         is_team_inbox: False,         view_style: "list",         url: "https://todoist.com/showProject?id=220474322",         parent_id: None,     ) ]`

`[     {         id: "220474322",         parentId: null,         order: 0,         color: "grey",         name: "Inbox",         commentCount: 10,         isShared: false,         isFavorite: false,         isInboxProject: true,         isTeamInbox: false,         url: "https://todoist.com/showProject?id=220474322",         viewStyle: "list"     } ]`

First, let's see how we can fetch a list of all the projects in a user's account.

We send a `GET` request to the `projects` endpoint at `https://api.todoist.com/rest/v2/projects`.

With every request to the REST API we pass an [authorization header][18] of type `Bearer` with the token for the user account. In the sample the token is set to `0123456789abcdef0123456789`, you should replace this with your own token.

The API responds with `200` status, and a JSON array containing the user's projects. In this case they have just one project: `Inbox`.

We import and construct an instance of `TodoistAPI` from the Python SDK.

In the constructor we pass the token for the user account, this token will be used for all subsequent requests using the client instance.

We then call the `get_projects` method on the API client, and we are returned a list of `Project` items. In this case the user has just one project: `Inbox`.

We import and construct an instance of the `TodoistApi` class from the JavaScript SDK.

In the constructor we pass the token for the user account, this token will be used for all subsequent requests using the client instance.

We then call the `getProjects` method on the client, and we are returned a list containing each of the user's projects. In this case the user has just one project: `Inbox`.

## Adding a new project

&gt; Sending the request:

`$ curl "https://api.todoist.com/rest/v2/projects" \     -X POST \     --data '{"name": "Shopping List"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer 0123456789abcdef0123456789"`

`try:     project = api.add_project(name="Shopping List")     print(project) except Exception as error:     print(error)`

`api.addProject({ name: "Shopping List" })     .then((project) =&gt; console.log(project))     .catch((error) =&gt; console.log(error))`

&gt; The response containing the project:

`{     "id": "2203306141",     "name": "Shopping List",     "comment_count": 0,     "color": "charcoal",     "is_shared": false,     "order": 1,     "is_favorite": false,     "is_inbox_project": false,     "is_team_inbox": false,     "view_style": "list",     "url": "https://todoist.com/showProject?id=2203306141",     "parent_id": null }`

`Project(     id: "2203306141",     name: "Shopping List",     comment_count: 0,     order: 0,     color: "charcoal",     is_shared: False,     is_favorite: False,     is_inbox_project: False,     is_team_inbox: False,     view_style: "list",     url: "https://todoist.com/showProject?id=2203306141",     parent_id: None, )`

`{     id: "2203306141",     parentId: null,     order: 0,     color: "charcoal",     name: "Shopping List",     commentCount: 0,     isShared: false,     isFavorite: false,     isInboxProject: false,     isTeamInbox: false,     url: "https://todoist.com/showProject?id=2203306141",     viewStyle: "list" }`

Next, let's add a new project to the user's account.

We send a `POST` request to the `projects` endpoint at `https://api.todoist.com/rest/v2/projects`.

As with the previous request, we send the same authorization header containing the user's token.

We'll be sending some JSON data in the body of this request, so we set the `Content-Type: application/json` header. We also generate and send an ID in the `X-Request-Id` header. This is optional but can be useful to prevent actions from being duplicated in the case of retrying failed requests. You can find further details about these headers in the [Request and response format][19] section.

In the body of the request we send a json-encoded object containing the property `name` with the value `Shopping List`. Setting the name is mandatory when creating a project, you can find details of the other optional values in the [Projects][20] section.

The API responds with `200` status, and a JSON object containing the data for the project that was added. Let's make a note of the `id` value as we'll use that in the next step.

We already have an instance of the `TodoistAPI` client from the previous request, so we'll use this to create a new project.

We call the `add_project` method this time, and we pass a name for the new project. The API client responds with a `Project` item containing the data for the new project.

Let's make a note of the `id` value as we'll use that in the next step.

We already have an instance of the `TodoistApi` client from the previous request, so we'll use this to create a new project.

We call the `addProject` method on the client, and we pass an object containing a name for the new project. The API client responds with an object containing the data for the new project.

Let's make a note of the `id` value as we'll use that in the next step.

## Adding a new task

&gt; Sending the request:

`$ curl "https://api.todoist.com/rest/v2/tasks" \     -X POST \     --data '{"content": "Buy Milk", "project_id": "2203306141"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer 0123456789abcdef0123456789"`

`try:     task = api.add_task(content="Buy Milk", project_id="2203306141")     print(task) except Exception as error:     print(error)`

`api.addTask({ content: "Buy Milk", projectId: "2203306141" })     .then((task) =&gt; console.log(task))     .catch((error) =&gt; console.log(error))`

&gt; The response containing the task:

`{     "id": "2995104339",     "content": "Buy Milk",     "description": "",     "comment_count": 0,     "is_completed": false,     "order": 1,     "priority": 1,     "project_id": "2203306141",     "labels": [],     "due": null,     "deadline": null,     "section_id": null,     "parent_id": null,     "creator_id": "2671355",     "created_at": "2019-12-11T22:36:50.000000Z",     "assignee_id": null,     "assigner_id": null,     "url": "https://todoist.com/showTask?id=2995104339" }`

`Task(     id: "2995104339",     content: "Buy Milk",     description: "",     comment_count: 0,     is_completed: False,     order: 1,     priority: 1,     project_id: "2203306141",     labels: [],     due: None,     deadline: None,     section_id: None,     parent_id: None,     creator_id: "2671355",     created_at: "2019-12-11T22:36:50.000000Z",     assignee_id: None,     assigner_id: None,     url: "https://todoist.com/showTask?id=2995104339" )`

`{     id: "2995104339",     content: "Buy Milk",     description: "",     commentCount: 0,     isCompleted: false,     order: 1,     priority: 1,     projectId: "2203306141",     labels: [],     due: null,     deadline: null,     sectionId: null,     parentId: null,     creatorId: "2671355",     createdAt: "2019-12-11T22:36:50.000000Z",     assigneeId: null,     assignerId: null,     url: "https://todoist.com/showTask?id=2995104339" }`

Next, let's add a new task to our project.

Again, we are sending a `POST` request, this time to the `tasks` endpoint at `https://api.todoist.com/rest/v2/tasks`.

As with all requests we provide the `Authorization` header. We also provide the `Content-Type: application/json` header and optional `X-Request-Id` as we are making a `POST` request.

We send JSON again in the post body. In this case we set the `content` of the task to `Buy Milk`. We set the optional `project_id` to the `id` value from the previous response to add the task to our Shopping List project.

For more information on the other optional values you can pass when adding a task, see the [Tasks][21] section.

The API responds with `200` status, and a JSON object containing the data for the task. We'll keep a note of the task `id` for use later.

This time, we make a call to the `add_task` method on the API client, and we pass a value for the `content` of the task. We set the optional `project_id` to the `id` value from the previous response to add the task to our Shopping List project.

The API client responds with a `Task` object containing the data for the task we created. We'll keep a note of the task `id` for use in the next request.

To add a new task, we make a call to the `addTask` method on the API client, and we pass an object containing a `content` value. We also include an optional value for `projectId`, with the `id` value from the previous response to add the task to our Shopping List project.

The API client responds with an object containing the data for the task we created. We'll keep a note of the task `id` for use in the next request.

## Updating a task

&gt; Sending the request:

`$ curl "https://api.todoist.com/rest/v2/tasks/2995104339" \     -X POST \     --data '{"due_string": "tomorrow"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer 0123456789abcdef0123456789"`

`try:     is_success = api.update_task(task_id="2995104339", due_string="tomorrow")     print(is_success) except Exception as error:     print(error)`

`api.updateTask("2995104339", { dueString: "tomorrow" })     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Sometimes we can't get everything done! We'll need to update the task to remember to get that milk tomorrow.

We'll be sending another `POST` request to update the task. This time we add the `id` of the task to the url of the `tasks` endpoint: `https://api.todoist.com/rest/v2/tasks/2995104339`.

We use the same headers for authorization and content-type. We also provide the optional request ID as we have in the previous steps.

This time we'll set the `due_string` property of the task to `tomorrow` in the JSON post body. The task will be automatically scheduled for tomorrow's date. You can find more information on due dates in our [Help Center][22].

The API will respond with status `204` to indicate that the request was successful.

We make a call to the `update_task` method on the API client, and we pass a `task_id` value with the `id` for the task we received in the previous request. We set the `due_string` property of the task to `tomorrow`, and the task will be automatically scheduled for tomorrow's date.

The API client responds with a boolean `True` value to confirm that the task has been updated.

We make a call to the `updateTask` method on the API client, and we pass the `id` for the task we received in the previous request. We also pass an object containing the values we want to update. In this case we set the `dueString` property of the task to `tomorrow`. This will cause the task to be automatically scheduled for tomorrow's date.

The API client responds with a boolean `true` value to confirm that the task has been updated.

## Completing a task

&gt; Sending the request:

`$ curl "https://api.todoist.com/rest/v2/tasks/2995104339/close" \     -X POST \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer 0123456789abcdef0123456789"`

`try:     is_success = api.close_task(task_id="2995104339")     print(is_success) except Exception as error:     print(error)`

`api.closeTask("2995104339")     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

We finally finished our task! It's time to mark it complete.

We send another `POST` request to the API. This time we add the `id` of the task to the url of the tasks endpoint, followed by the `/close` path: `https://api.todoist.com/rest/v2/tasks/2995104339/close`.

We'll pass the authorization header but no need to specify the content-type as there is no content to send in the body of this request. We'll provide the optional request ID as we have in the previous examples.

The API will respond with status `204` to indicate that the task has been marked as complete.

We make a call to the `close_task` method on the API client, again we pass the `task_id` value with the `id` for the task.

The API client responds with a boolean `True` value to confirm that the task has been marked as complete.

We make a call to the `closeTask` method on the API client, and we pass the `id` for the task.

The API client responds with a boolean `true` value to confirm that the task has been marked as complete.

## Deleting a project

&gt; Sending the request:

`$ curl -X DELETE "https://api.todoist.com/rest/v2/projects/2203306141" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer 0123456789abcdef0123456789"`

`try:     is_success = api.delete_project(project_id="2203306141")     print(is_success) except Exception as error:     print(error)`

`api.deleteProject("2203306141")     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

We finished all the tasks in our Shopping List project, so we can now delete it.

We'll send a `DELETE` request this time by adding the `id` for the project to the `projects` endpoint: `https://api.todoist.com/rest/v2/projects/2203306141`.

As before, we set the authorization header with our token and provide a value for the optional request ID header.

The API responds with status `204` to indicate that the project has been successfully deleted.

We make a call to the `delete_project` method on the API client, and we pass the `project_id` value with the `id` for the Shopping List project.

The API client responds with a boolean `True` value to confirm that the project has been deleted.

We make a call to the `deleteProject` method on the API client, and we pass the `id` for the Shopping List project.

The API client responds with a boolean `true` value to confirm that the project has been deleted.

## Next Steps

That's all there is to it! We've covered the basic concepts of interacting with the Todoist REST API and SDK clients.

You can find details of all the available endpoints and parameters for the various Todoist entity types in the reference documentation below.

In order to make requests for other users you'll need to obtain an auth token from them. You can find details on how to implement this in the [Authorization][23] guide.

# Authorization

&gt; An authenticated request with authorization header:

`$ curl -X GET \   https://api.todoist.com/rest/v2/projects \   -H "Authorization: Bearer $token"`

In order to make authorized calls to the REST API, your application must provide an [authorization header][24] with the appropriate `Bearer $token`. For working through the examples, you can obtain your personal API token from the [integrations settings][25] for your account.

To authenticate other users your application will need to obtain a token from them using the OAuth protocol. For information on how to obtain a token from our service using OAuth, please see the [authorization guide][26].

Note that we're using `$token` on all of our `curl` examples, so you can define a temporary environment variable containing your token and easily copy &amp; paste `curl` commands into your terminal.

# Projects

&gt; An example Project object:

`{     "id": "2203306141",     "name": "Shopping List",     "comment_count": 10,     "order": 1,     "color": "charcoal",     "is_shared": false,     "is_favorite": false,     "parent_id": "220325187",     "is_inbox_project": false,     "is_team_inbox": false,     "view_style": "list",     "url": "https://todoist.com/showProject?id=2203306141" }`

`Project(     id: "2203306141",     name: "Shopping List",     comment_count: 10,     order: 1,     color: "charcoal",     is_shared: False,     is_favorite: False,     is_inbox_project: False,     is_team_inbox: False,     view_style: "list",     url: "https://todoist.com/showProject?id=2203306141",     parent_id: None, )`

`{     id: "2203306141",     parentId: null,     order: 0,     color: "charcoal",     name: "Shopping List",     commentCount: 10,     isShared: false,     isFavorite: false,     isInboxProject: false,     isTeamInbox: false,     url: "https://todoist.com/showProject?id=2203306141",     viewStyle: "list" }`

#### Properties

Property

Description

id *String*

Project ID.

name *String*

Project name.

color *String*

The color of the project icon. Refer to the `name` column in the [Colors][27] guide for more info.

parent\_id *String*

ID of parent project (will be `null` for top-level projects).

order *Integer*

Project position under the same parent (read-only, will be `0` for inbox and team inbox projects).

comment\_count *Integer*

Number of project comments.

is\_shared *Boolean*

Whether the project is shared (read-only, a `true` or `false` value).

is\_favorite *Boolean*

Whether the project is a favorite (a `true` or `false` value).

is\_inbox\_project *Boolean*

Whether the project is the user's `Inbox` (read-only).

is\_team\_inbox *Boolean*

Whether the project is the `Team Inbox` (read-only).

view\_style *String*

A string value (either `list` or `board`). This determines the way the project is displayed within the Todoist clients.

url *String*

URL to access this project in the Todoist web or mobile applications.

## Get all projects

&gt; Get all projects:

`$ curl -X GET \   https://api.todoist.com/rest/v2/projects \   -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     projects = api.get_projects()     print(projects) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getProjects()     .then((projects) =&gt; console.log(projects))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`[     {         "id": "220474322",         "name": "Inbox",         "comment_count": 10,         "order": 0,         "color": "grey",         "is_shared": false,         "is_favorite": false,         "is_inbox_project": true,         "is_team_inbox": false,         "view_style": "list",         "url": "https://todoist.com/showProject?id=220474322",         "parent_id": null,     } ]`

`[     Project(         id: "220474322",         name: "Inbox",         comment_count: 10,         order: 0,         color: "grey",         is_shared: False,         is_favorite: False,         is_inbox_project: True,         is_team_inbox: False,         view_style: "list",         url: "https://todoist.com/showProject?id=220474322",         parent_id: None,     ) ]`

`[     {         id: "220474322",         parentId: null,         order: 0,         color: "grey",         name: "Inbox",         commentCount: 10,         isShared: false,         isFavorite: false,         isInboxProject: true,         isTeamInbox: false,         url: "https://todoist.com/showProject?id=220474322",         viewStyle: "list"     } ]`

Returns JSON-encoded array containing all user projects.

A successful response has `200 OK` status and `application/json` Content-Type.

## Create a new project

&gt; Create a new project:

`$ curl "https://api.todoist.com/rest/v2/projects" \     -X POST \     --data '{"name": "Shopping List"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     project = api.add_project(name="Shopping List")     print(project) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.addProject({ name: "Shopping List" })     .then((project) =&gt; console.log(project))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "id": "2203306141",     "name": "Shopping List",     "comment_count": 0,     "color": "charcoal",     "is_shared": false,     "order": 1,     "is_favorite": true,     "is_inbox_project": false,     "is_team_inbox": false,     "view_style": "list",     "url": "https://todoist.com/showProject?id=2203306141",     "parent_id": null }`

`Project(     id: "2203306141",     name: "Shopping List",     comment_count: 0,     order: 1,     color: "charcoal",     is_shared: False,     is_favorite: False,     is_inbox_project: False,     is_team_inbox: False,     view_style: "list",     url: "https://todoist.com/showProject?id=2203306141",     parent_id: None, )`

`{     id: "2203306141",     parentId: null,     order: 0,     color: "charcoal",     name: "Shopping List",     commentCount: 0,     isShared: false,     isFavorite: false,     isInboxProject: false,     isTeamInbox: false,     url: "https://todoist.com/showProject?id=2203306141",     viewStyle: "list" }`

Creates a new project and returns it as a JSON object.

A successful response has `200 OK` status and `application/json` Content-Type.

#### Parameters

Parameter

Required

Description

name *String*

Yes

Name of the project.

parent\_id *String*

No

Parent project ID.

color *String*

No

The color of the project icon. Refer to the `name` column in the [Colors][28] guide for more info.

is\_favorite *Boolean*

No

Whether the project is a favorite (a `true` or `false` value).

view\_style *String*

No

A string value (either `list` or `board`, default is `list`). This determines the way the project is displayed within the Todoist clients.

## Get a project

&gt; Get a project:

`$ curl "https://api.todoist.com/rest/v2/projects/2203306141" \   -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     project = api.get_project(project_id="2203306141")     print(project) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getProject("2203306141")     .then((project) =&gt; console.log(project))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "id": "2203306141",     "name": "Shopping List",     "comment_count": 0,     "color": "charcoal",     "is_shared": false,     "order": 1,     "is_favorite": false,     "is_inbox_project": false,     "is_team_inbox": false,     "view_style": "list",     "url": "https://todoist.com/showProject?id=2203306141",     "parent_id": null }`

`Project(     id: "2203306141",     name: "Shopping List",     comment_count: 0,     order: 1,     color: "charcoal",     is_shared: False,     is_favorite: False,     is_inbox_project: False,     is_team_inbox: False,     view_style: "list",     url: "https://todoist.com/showProject?id=2203306141",     parent_id: None, )`

`{     id: "2203306141",     parentId: null,     order: 0,     color: "charcoal",     name: "Shopping List",     commentCount: 0,     isShared: false,     isFavorite: false,     isInboxProject: false,     isTeamInbox: false,     url: "https://todoist.com/showProject?id=2203306141",     viewStyle: "list" }`

Returns a JSON object containing a project object related to the given ID.

A successful response has `200 OK` status and `application/json` Content-Type.

## Update a project

&gt; Update a project:

`$ curl "https://api.todoist.com/rest/v2/projects/2203306141" \     -X POST \     --data '{"name": "Things To Buy"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.update_project(project_id="2203306141", name="Things To Buy")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.updateProject("2203306141", { name: "Things To Buy" })     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "id": "2203306141",     "name": "Things to buy",     "comment_count": 0,     "color": "charcoal",     "is_shared": false,     "order": 1,     "is_favorite": false,     "is_inbox_project": false,     "is_team_inbox": false,     "view_style": "list",     "url": "https://todoist.com/showProject?id=2203306141",     "parent_id": null }`

`Project(     id: "2203306141",     name: "Things to buy",     comment_count: 0,     order: 1,     color: "charcoal",     is_shared: False,     is_favorite: False,     is_inbox_project: False,     is_team_inbox: False,     view_style: "list",     url: "https://todoist.com/showProject?id=2203306141",     parent_id: None, )`

`{     id: "2203306141",     parentId: null,     order: 0,     color: "charcoal",     name: "Things to buy",     commentCount: 0,     isShared: false,     isFavorite: false,     isInboxProject: false,     isTeamInbox: false,     url: "https://todoist.com/showProject?id=2203306141",     viewStyle: "list" }`

Returns a JSON object containing the updated project object.

A successful response has `200 OK` status and `application/json` Content-Type.

#### Parameters

Parameter

Required

Description

name *String*

No

Name of the project.

color *String*

No

The color of the project icon. Refer to the `name` column in the [Colors][29] guide for more info.

is\_favorite *Boolean*

No

Whether the project is a favorite (a `true` or `false` value).

view\_style *String*

No

A string value (either `list` or `board`). This determines the way the project is displayed within the Todoist clients.

## Delete a project

&gt; Delete a project:

`$ curl -X DELETE "https://api.todoist.com/rest/v2/projects/2203306141" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.delete_project(project_id="2203306141")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.deleteProject("2203306141")     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Deletes a project and all of its sections and tasks.

A successful response has `204 No Content` status and an empty body.

## Get all collaborators

&gt; Get all collaborators of a shared project:

`$ curl -X GET \   "https://api.todoist.com/rest/v2/projects/2203306141/collaborators" \   -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     collaborators = api.get_collaborators(project_id="2203306141")     print(collaborators) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getProjectCollaborators("2203306141")     .then((collaborators) =&gt; console.log(collaborators))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`[     {         "id": "2671362",         "name": "Alice",         "email": "alice@example.com"     },     {         "id": "2671366",         "name": "Bob",         "email": "bob@example.com"     } ]`

`[     Collaborator(         id: "2671362",         name: "Alice",         email: "alice@example.com"     ),     Collaborator(         id: "2671366",         name: "Bob",         email: "bob@example.com"     ) ]`

`[     {         id: "2671362",         name: "Alice",         email: "alice@example.com"     },     {         id: "2671366",         name: "Bob",         email: "bob@example.com"     } ]`

Returns JSON-encoded array containing all collaborators of a shared project.

A successful response has `200 OK` status and `application/json` Content-Type.

# Sections

&gt; An example Section object:

`{     "id": "7025",     "project_id": "2203306141",     "order": 1,     "name": "Groceries" }`

`Section(     id: "7025",     project_id: "2203306141",     order: 1,     name: "Groceries" )`

`{     id: "7025",     projectId: "2203306141",     order: 1,     name: "Groceries" }`

#### Properties

Property

Description

id *String*

Section id

project\_id *String*

ID of the project section belongs to

order *Integer*

Section position among other sections from the same project

name *String*

Section name

## Get all sections

&gt; Get all sections:

`$ curl -s -H "Authorization: Bearer $token" \     https://api.todoist.com/rest/v2/sections?project_id=2203306141`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     sections = api.get_sections(project_id="2203306141")     print(sections) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getSections("2203306141")     .then((sections) =&gt; console.log(sections))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`[     {         "id": "7025",         "project_id": "2203306141",         "order": 1,         "name": "Groceries"     } ]`

`[     Section(         id: "7025",         project_id: "2203306141",         order: 1,         name: "Groceries"     ) ]`

`[     {         id: "7025",         projectId: "2203306141",         order: 1,         name: "Groceries"     } ]`

Returns a JSON array of all sections.

A successful response has `200 OK` status and `application/json` Content-Type.

#### Parameters

Parameter

Required

Description

project\_id *String*

No

Filter sections by project ID.

## Create a new section

&gt; Create a new section:

`$ curl -s -X POST --data '{"project_id":"2203306141", "name":"Groceries"}' \     -H "Content-Type: application/json" \     -H "Authorization: Bearer $token" \     https://api.todoist.com/rest/v2/sections`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     section = api.add_section(name="Groceries", project_id="2203306141")     print(section) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.addSection({ name: "Groceries", projectId: "2203306141" })     .then((section) =&gt; console.log(section))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "id": "7025",     "project_id": "2203306141",     "order": 1,     "name": "Groceries" }`

`Section(     id: "7025",     project_id: "2203306141",     order: 1,     name: "Groceries" )`

`{     id: "7025",     projectId: "2203306141",     order: 1,     name: "Groceries" }`

Creates a new section and returns it as a JSON object.

A successful response has `200 OK` status and `application/json` Content-Type.

#### Parameters

Parameter

Required

Description

name *String*

Yes

Section name

project\_id *String*

Yes

Project ID this section should belong to

order *Integer*

No

Order among other sections in a project

## Get a single section

&gt; Get a single section:

`$ curl -s -H "Authorization: Bearer $token" \     https://api.todoist.com/rest/v2/sections/7025`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     section = api.get_section(section_id="7025")     print(section) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getSection("7025")     .then((section) =&gt; console.log(section))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "id": "7025",     "project_id": "2203306141",     "order": 1,     "name": "Groceries" }`

`Section(     id: "7025",     project_id: "2203306141",     order: 1,     name: "Groceries" )`

`{     id: "7025",     projectId: "2203306141",     order: 1,     name: "Groceries" }`

Returns a single section as a JSON object.

A successful response has `200 OK` status and `application/json` Content-Type.

If the section's ID has changed (this can happen in some cases when the section is moved to another project), the response will be `301 Moved Permanently`, and the new URL is returned in the `Location` header.

## Update a section

&gt; Update a section:

`$ curl -s -X POST --data '{"name":"Supermarket"}' \     -H "Content-Type: application/json" \     -H "Authorization: Bearer $token" \     https://api.todoist.com/rest/v2/sections/7025`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.update_section(section_id="7025", name="Supermarket")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.updateSection("7025", { name: "Supermarket" })     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "id": "7025",     "project_id": "2203306141",     "order": 1,     "name": "Supermarket" }`

`Section(     id: "7025",     project_id: "2203306141",     order: 1,     name: "Supermarket" )`

`{     id: "7025",     projectId: "2203306141",     order: 1,     name: "Supermarket" }`

Returns the updated section as a JSON object.

A successful response has `200 OK` status and `application/json` Content-Type.

#### Parameters

Parameter

Required

Description

name *String*

Yes

Section name

## Delete a section

&gt; Delete a section:

`$ curl -X DELETE -H "Authorization: Bearer $token" \     https://api.todoist.com/rest/v2/sections/7025`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.delete_section(section_id="7025")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.deleteSection("7025")     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Deletes a section and all of its tasks.

A successful response has `204 No Content` status and an empty body.

# Tasks

&gt; An example Task object:

`{     "creator_id": "2671355",     "created_at": "2019-12-11T22:36:50.000000Z",     "assignee_id": "2671362",     "assigner_id": "2671355",     "comment_count": 10,     "is_completed": false,     "content": "Buy Milk",     "description": "",     "due": {         "date": "2016-09-01",         "is_recurring": false,         "datetime": "2016-09-01T12:00:00.000000Z",         "string": "tomorrow at 12",         "timezone": "Europe/Moscow"     },     "deadline": {         "date": "2016-09-04"     },     "duration": {          "amount": 15,          "unit": "minute"     },     "id": "2995104339",     "labels": ["Food", "Shopping"],     "order": 1,     "priority": 1,     "project_id": "2203306141",     "section_id": "7025",     "parent_id": "2995104589",     "url": "https://todoist.com/showTask?id=2995104339" }`

`Task(     creator_id: "2671355",     created_at: "2019-12-11T22:36:50.000000Z",     assignee_id: "2671362",     assigner_id: "2671355",     comment_count: 10,     is_completed: False,     content: "Buy Milk",     description: "",     due: {         date: "2016-09-01",         is_recurring: false,         datetime: "2016-09-01T12:00:00.000000Z",         string: "tomorrow at 12",         timezone: "Europe/Moscow"     },     deadline: {         date: "2016-09-04"     },     duration: {          amount: 15,          unit: "minute"     },     id: "2995104339",     labels: ["Food", "Shopping"],     order: 1,     priority: 1,     project_id: "2203306141",     section_id: "7025",     parent_id: "2995104589",     url: "https://todoist.com/showTask?id=2995104339" )`

`{     creatorId: "2671355",     createdAt: "2019-12-11T22:36:50.000000Z",     assigneeId: "2671362",     assignerId: "2671355",     commentCount: 10,     isCompleted: false,     content: "Buy Milk",     description: "",     due: {         date: "2016-09-01",         isRecurring: false,         datetime: "2016-09-01T12:00:00.000000Z",         string: "tomorrow at 12",         timezone: "Europe/Moscow"     },     deadline: {         date: "2016-09-04"     },     duration: {          amount: 15,          unit: "minute"     },     id: "2995104339",     labels: ["Food", "Shopping"],     order: 1,     priority: 1,     projectId: "2203306141",     sectionId: "7025",     parentId: "2995104589",     url: "https://todoist.com/showTask?id=2995104339" }`

#### Properties

Property

Description

id *String*

Task ID.

project\_id *String*

Task's project ID (read-only).

section\_id *String*

ID of section task belongs to (read-only, will be `null` when the task has no parent section).

content *String*

Task content. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the [Text Formatting article][30] in the Help Center.

description *String*

A description for the task. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the [Text Formatting article][31] in the Help Center.

is\_completed *Boolean*

Flag to mark completed tasks.

labels *Array of String*

The task's labels (a list of names that may represent either personal or shared labels).

parent\_id *String*

ID of parent task (read-only, will be `null` for top-level tasks).

order *Integer*

Position under the same parent or project for top-level tasks (read-only).

priority *Integer*

Task priority from 1 (normal, default value) to 4 (urgent).

due *Object*

object representing task due date/time, or `null` if no date is set (described below).

deadline *Object*

object representing task deadline date, or `null` if not deadline is set (described below).

url *String*

URL to access this task in the Todoist web or mobile applications (read-only).

comment\_count *Integer*

Number of task comments (read-only).

created\_at *String*

The date when the task was created (read-only).

creator\_id *String*

The ID of the user who created the task (read-only).

assignee\_id *String*

The responsible user ID (will be `null` if the task is unassigned).

assigner\_id *String*

The ID of the user who assigned the task (read-only, will be `null` if the task is unassigned).

duration *Object*

Object representing a task's duration. Includes a positive integer (greater than zero) for the `amount` of time the task will take, and the `unit` of time that the amount represents which must be either `minute` or `day`. Both the `amount` and `unit` **must** be defined. The object will be `null` if the task has no duration.

#### Due object

Parameter

Required

Description

string *String*

Yes

Human defined date in arbitrary format.

date *String*

Yes

Date in format `YYYY-MM-DD` corrected to user's timezone.

is\_recurring *Boolean*

Yes

Whether the task has a [recurring due date][32].

datetime *String*

No

Only returned if exact due time set (i.e. it's not a whole-day task), date and time in [RFC3339][33] format in UTC.

timezone *String*

No

Only returned if exact due time set, user's timezone definition either in tzdata-compatible format ("Europe/Berlin") or as a string specifying east of UTC offset as "UTC±HH:MM" (i.e. "UTC-01:00").

lang *string*

No

Lang which has to be used to parse the content of the string attribute. Used by clients and on the server side to properly process due dates. Valid languages are: `en`, `da`, `pl`, `zh`, `ko`, `de`, `pt`, `ja`, `it`, `fr`, `sv`, `ru`, `es`, `nl`, `fi`, `nb`, `tw`.

#### Deadline object

Parameter

Required

Description

date *String*

Yes

Date in format `YYYY-MM-DD` corrected to user's timezone.

lang *string*

No

Lang which has to be used to parse the content of the string attribute. Used by clients and on the server side to properly process deadlines. Valid languages are: `en`, `da`, `pl`, `zh`, `ko`, `de`, `pt`, `ja`, `it`, `fr`, `sv`, `ru`, `es`, `nl`, `fi`, `nb`, `tw`.

## Get active tasks

&gt; Get active tasks:

`$ curl -X GET \   https://api.todoist.com/rest/v2/tasks \   -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     tasks = api.get_tasks()     print(tasks) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getTasks()     .then((tasks) =&gt; console.log(tasks))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`[     {         "creator_id": "2671355",         "created_at": "2019-12-11T22:36:50.000000Z",         "assignee_id": "2671362",         "assigner_id": "2671355",         "comment_count": 10,         "is_completed": false,         "content": "Buy Milk",         "description": "",         "due": {             "date": "2016-09-01",             "is_recurring": false,             "datetime": "2016-09-01T12:00:00.000000Z",             "string": "tomorrow at 12",             "timezone": "Europe/Moscow"         },         "deadline": {             "date": "2016-09-04"         },         "duration": null,         "id": "2995104339",         "labels": ["Food", "Shopping"],         "order": 1,         "priority": 1,         "project_id": "2203306141",         "section_id": "7025",         "parent_id": "2995104589",         "url": "https://todoist.com/showTask?id=2995104339"     },     ... ]`

`[     Task(         creator_id: "2671355",         created_at: "2019-12-11T22:36:50.000000Z",         assignee_id: "2671362",         assigner_id: "2671355",         comment_count: 10,         is_completed: False,         content: "Buy Milk",         description: "",         due: {             date: "2016-09-01",             is_recurring: false,             datetime: "2016-09-01T12:00:00.000000Z",             string: "tomorrow at 12",             timezone: "Europe/Moscow"         },         deadline: {             date: "2016-09-04"         },         duration: None,         id: "2995104339",         labels: ["Food", "Shopping"],         order: 1,         priority: 1,         project_id: "2203306141",         section_id: "7025",         parent_id: "2995104589",         url: "https://todoist.com/showTask?id=2995104339"     ) ]`

`[     {         creatorId: "2671355",         createdAt: "2019-12-11T22:36:50.000000Z",         assigneeId: "2671362",         assignerId: "2671355",         commentCount: 10,         isCompleted: false,         content: "Buy Milk",         description: "",         due: {             date: "2016-09-01",             isRecurring: false,             datetime: "2016-09-01T09:00:00.000000Z",             string: "tomorrow at 12",             timezone: "Europe/Moscow"         },         deadline: {             date: "2016-09-04"         },         duration: null,         id: "2995104339",         labels: ["Food", "Shopping"],         order: 1,         priority: 1,         projectId: "2203306141",         sectionId: "7025",         parentId: "2995104589",         url: "https://todoist.com/showTask?id=2995104339"     } ]`

Returns a JSON-encoded array containing all active tasks.

A successful response has `200 OK` status and `application/json` Content-Type.

#### Parameters

Parameter

Required

Description

project\_id *String*

No

Filter tasks by project ID.

section\_id *String*

No

Filter tasks by section ID.

label *String*

No

Filter tasks by label name.

filter *String*

No

Filter by any [supported filter][34]. Multiple filters (using the comma `,` operator) are not supported.

lang *String*

No

IETF language tag defining what language filter is written in, if differs from default English.

ids *Array of integers*

No

A list of the task IDs to retrieve, this should be a comma separated list.

**Precedence of parameters**

When fetching a list of tasks, the API will do so in the following order: - `filter` (with or without `lang`) - `ids` - `label`/`project_id`/`section_id`

If you include a filter *and* IDs, only the filter will be used. If you include IDs and project\_id, only IDs is used, and so on.

## Create a new task

&gt; Create a new task:

`$ curl "https://api.todoist.com/rest/v2/tasks" \     -X POST \     --data '{"content": "Buy Milk", "due_string": "tomorrow at 12:00", "due_lang": "en", "priority": 4}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     task = api.add_task(         content="Buy Milk",         due_string="tomorrow at 12:00",         due_lang="en",         priority=4,     )     print(task) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.addTask({     content: "Buy Milk",     dueString: "tomorrow at 12:00",     dueLang: "en",     priority: 4 })     .then((task) =&gt; console.log(task))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "creator_id": "2671355",     "created_at": "2019-12-11T22:36:50.000000Z",     "assignee_id": null,     "assigner_id": null,     "comment_count": 0,     "is_completed": false,     "content": "Buy Milk",     "description": "",     "due": {         "date": "2016-09-01",         "is_recurring": false,         "datetime": "2016-09-01T12:00:00.000000Z",         "string": "tomorrow at 12",         "timezone": "Europe/Moscow"     },     "deadline": {         "date": "2016-09-04"     },     "duration": null,     "id": "2995104339",     "labels": [],     "order": 1,     "priority": 4,     "project_id": "2203306141",     "section_id": null,     "parent_id": null,     "url": "https://todoist.com/showTask?id=2995104339" }`

`Task(     creator_id: "2671355",     created_at: "2019-12-11T22:36:50.000000Z",     assignee_id: None,     assigner_id: None,     comment_count: 0,     is_completed: False,     content: "Buy Milk",     description: "",     due: {         date: "2016-09-01",         is_recurring: false,         datetime: "2016-09-01T12:00:00.000000Z",         string: "tomorrow at 12",         timezone: "Europe/Moscow"     },     deadline: {         date: "2016-09-04"     },     duration: None,     id: "2995104339",     labels: [],     order: 1,     priority: 4,     project_id: "2203306141",     section_id: None,     parent_id: None,     url: "https://todoist.com/showTask?id=2995104339" )`

`{     creatorId: "2671355",     createdAt: "2019-12-11T22:36:50.000000Z",     assigneeId: null,     assignerId: null,     commentCount: 0,     isCompleted: false,     content: "Buy Milk",     description: "",     due: {         date: "2016-09-01",         isRecurring: false,         datetime: "2016-09-01T12:00:00.000000Z",         string: "tomorrow at 12",         timezone: "Europe/Moscow"     },     deadline: {         date: "2016-09-04"     },     duration: null,     id: "2995104339",     labels: [],     order: 1,     priority: 4,     projectId: "2203306141",     sectionId: null,     parentId: null,     url: "https://todoist.com/showTask?id=2995104339" }`

Creates a new task and returns it as a JSON object.

A successful response has `200 OK` status and `application/json` Content-Type.

#### JSON body parameters

Parameter

Required

Description

content *String*

Yes

Task content. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the [Text Formatting article][35] in the Help Center.

description *String*

No

A description for the task. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the [Text Formatting article][36] in the Help Center.

project\_id *String*

No

Task project ID. If not set, task is put to user's Inbox.

section\_id *String*

No

ID of section to put task into.

parent\_id *String*

No

Parent task ID.

order *Integer*

No

Non-zero integer value used by clients to sort tasks under the same parent.

labels *Array of String*

No

The task's labels (a list of names that may represent either personal or shared labels).

priority *Integer*

No

Task priority from 1 (normal) to 4 (urgent).

due\_string *String*

No

[Human defined][37] task due date (ex.: "next Monday", "Tomorrow"). Value is set using local (not UTC) time.

due\_date *String*

No

Specific date in `YYYY-MM-DD` format relative to user’s timezone.

due\_datetime *String*

No

Specific date and time in [RFC3339][38] format in UTC.

due\_lang *String*

No

2-letter code specifying language in case `due_string` is not written in English.

assignee\_id *String*

No

The responsible user ID (only applies to shared tasks).

duration *Integer*

No

A positive (greater than zero) integer for the amount of `duration_unit` the task will take. If specified, you **must** define a `duration_unit`.

duration\_unit *String*

No

The unit of time that the `duration` field above represents. Must be either `minute` or `day`. If specified, `duration` **must** be defined as well.

deadline\_date *String*

No

Specific date in `YYYY-MM-DD` format relative to user’s timezone.

deadline\_lang *String*

No

2-letter code specifying language of deadline.

Please note that only one of the `due_*` fields can be used at the same time (`due_lang` is a special case).

## Get an active task

&gt; Get an active task:

`$ curl "https://api.todoist.com/rest/v2/tasks/2995104339" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     task = api.get_task(task_id="2995104339")     print(task) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getTask("2995104339")     .then((task) =&gt; console.log(task))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "creator_id": "2671355",     "created_at": "2019-12-11T22:36:50.000000Z",     "assignee_id": "2671362",     "assigner_id": "2671355",     "comment_count": 10,     "is_completed": false,     "content": "Buy Milk",     "description": "",     "due": {         "date": "2016-09-01",         "is_recurring": false,         "datetime": "2016-09-01T12:00:00.000000Z",         "string": "tomorrow at 12",         "timezone": "Europe/Moscow"     },     "deadline": {         "date": "2016-09-04"     },     "duration": null,     "id": "2995104339",     "labels": ["Food", "Shopping"],     "order": 1,     "priority": 1,     "project_id": "2203306141",     "section_id": "7025",     "parent_id": "2995104589",     "url": "https://todoist.com/showTask?id=2995104339" }`

`Task(     creator_id: "2671355",     created_at: "2019-12-11T22:36:50.000000Z",     assignee_id: "2671362",     assigner_id: "2671355",     comment_count: 10,     is_completed: False,     content: "Buy Milk",     description: "",     due: {         date: "2016-09-01",         is_recurring: false,         datetime: "2016-09-01T12:00:00.000000Z",         string: "tomorrow at 12",         timezone: "Europe/Moscow"     },     deadline: {         date: "2016-09-04"     },     duration: None,     id: "2995104339",     labels: ["Food", "Shopping"],     order: 1,     priority: 1,     project_id: "2203306141",     section_id: "7025",     parent_id: "2995104589",     url: "https://todoist.com/showTask?id=2995104339" )`

`{     creatorId: "2671355",     createdAt: "2019-12-11T22:36:50.000000Z",     assigneeId: "2671362",     assignerId: "2671355",     commentCount: 10,     isCompleted: false,     content: "Buy Milk",     description: "",     due: {         date: "2016-09-01",         isRecurring: false,         datetime: "2016-09-01T12:00:00.000000Z",         string: "tomorrow at 12",         timezone: "Europe/Moscow"     },     deadline: {         date: "2016-09-04"     },     duration: null,     id: "2995104339",     labels: ["Food", "Shopping"],     order: 1,     priority: 1,     projectId: "2203306141",     sectionId: "7025",     parentId: "2995104589",     url: "https://todoist.com/showTask?id=2995104339" }`

Returns a single active (non-completed) task by ID as a JSON object.

A successful response has `200 OK` status and `application/json` Content-Type.

If the task's ID has changed (this can happen in some cases when the task is moved to another project), the response will be `301 Moved Permanently`, and the new URL is returned in the `Location` header.

## Update a task

&gt; Update a task:

`$ curl "https://api.todoist.com/rest/v2/tasks/2995104339" \     -X POST \     --data '{"content": "Buy Coffee"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.update_task(task_id="2995104339", content="Buy Coffee")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.updateTask("2995104339", { content: "Buy Coffee" })     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "creator_id": "2671355",     "created_at": "2019-12-11T22:36:50.000000Z",     "assignee_id": "2671362",     "assigner_id": "2671355",     "comment_count": 10,     "is_completed": false,     "content": "Buy Coffee",     "description": "",     "due": {         "date": "2016-09-01",         "is_recurring": false,         "datetime": "2016-09-01T12:00:00.000000Z",         "string": "tomorrow at 12",         "timezone": "Europe/Moscow"     },     "deadline": {         "date": "2016-09-04"     },     "duration": null,     "id": "2995104339",     "labels": ["Food", "Shopping"],     "order": 1,     "priority": 1,     "project_id": "2203306141",     "section_id": "7025",     "parent_id": "2995104589",     "url": "https://todoist.com/showTask?id=2995104339" }`

`Task(     creator_id: "2671355",     created_at: "2019-12-11T22:36:50.000000Z",     assignee_id: "2671362",     assigner_id: "2671355",     comment_count: 10,     is_completed: False,     content: "Buy Coffee",     description: "",     due: {         date: "2016-09-01",         is_recurring: false,         datetime: "2016-09-01T12:00:00.000000Z",         string: "tomorrow at 12",         timezone: "Europe/Moscow"     },     deadline: {         date: "2016-09-04"     },     duration: None,     id: "2995104339",     labels: ["Food", "Shopping"],     order: 1,     priority: 1,     project_id: "2203306141",     section_id: "7025",     parent_id: "2995104589",     url: "https://todoist.com/showTask?id=2995104339" )`

`{     creatorId: "2671355",     createdAt: "2019-12-11T22:36:50.000000Z",     assigneeId: "2671362",     assignerId: "2671355",     commentCount: 10,     isCompleted: false,     content: "Buy Coffee",     description: "",     due: {         date: "2016-09-01",         isRecurring: false,         datetime: "2016-09-01T12:00:00.000000Z",         string: "tomorrow at 12",         timezone: "Europe/Moscow"     },     deadline: {         date: "2016-09-04"     },     duration: null,     id: "2995104339",     labels: ["Food", "Shopping"],     order: 1,     priority: 1,     projectId: "2203306141",     sectionId: "7025",     parentId: "2995104589",     url: "https://todoist.com/showTask?id=2995104339" }`

Returns the updated task as a JSON object.

A successful response has `200 OK` status and `application/json` Content-Type.

#### JSON body parameters

Parameter

Required

Description

content *String*

No

Task content. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the [Text Formatting article][39] in the Help Center.

description *String*

No

A description for the task. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the [Text Formatting article][40] in the Help Center.

labels *Array of String*

No

The task's labels (a list of names that may represent either personal or shared labels).

priority *Integer*

No

Task priority from 1 (normal) to 4 (urgent).

due\_string *String*

No

[Human defined][41] task due date (ex.: "next Monday", "Tomorrow"). Value is set using local (not UTC) time. Using "no date" or "no due date" removes the date.

due\_date *String*

No

Specific date in `YYYY-MM-DD` format relative to user’s timezone.

due\_datetime *String*

No

Specific date and time in [RFC3339][42] format in UTC.

due\_lang *String*

No

2-letter code specifying language in case `due_string` is not written in English.

assignee\_id *String*

No

The responsible user ID or `null` to unset (for shared tasks).

duration *Integer*

No

A positive (greater than zero) integer for the amount of `duration_unit` the task will take, or `null` to unset. If specified, you **must** define a `duration_unit`.

duration\_unit *String*

No

The unit of time that the `duration` field above represents, or `null` to unset. Must be either `minute` or `day`. If specified, `duration` **must** be defined as well.

deadline\_date *String*

No

Specific date in `YYYY-MM-DD` format relative to user’s timezone.

deadline\_lang *String*

No

2-letter code specifying language of deadline.

Please note that only one of the `due_*` fields can be used at the same time (`due_lang` is a special case).

## Close a task

&gt; Close a task:

`$ curl -X POST "https://api.todoist.com/rest/v2/tasks/2995104339/close" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.close_task(task_id="2995104339")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.closeTask("2995104339")     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Closes a task.

A successful response has `204 No Content` status and an empty body.

The command performs in the same way as our official clients:

-   Regular tasks are marked complete and moved to history, along with their subtasks.
-   Tasks with [recurring due dates][43] will be scheduled to their next occurrence.

## Reopen a task

&gt; Reopen a task:

`$ curl -X POST "https://api.todoist.com/rest/v2/tasks/2995104339/reopen" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.reopen_task(task_id="2995104339")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.reopenTask("2995104339")     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Reopens a task.

A successful response has `204 No Content` status and an empty body.

Any ancestor items or sections will also be marked as uncomplete and restored from history.

The reinstated items and sections will appear at the end of the list within their parent, after any previously active items.

## Delete a task

&gt; Delete a task:

`$ curl -X DELETE "https://api.todoist.com/rest/v2/tasks/2995104339" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.delete_task(task_id="2995104339")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.deleteTask("2995104339")     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Deletes a task.

A successful response has `204 No Content` status and an empty body.

# Comments

&gt; An example Comment object:

`{     "content": "Need one bottle of milk",     "id": "2992679862",     "posted_at": "2016-09-22T07:00:00.000000Z",     "project_id": null,     "task_id": "2995104339",     "attachment": {         "file_name": "File.pdf",         "file_type": "application/pdf",         "file_url": "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         "resource_type": "file"     } }`

`Comment(     content: "Need one bottle of milk",     id: "2992679862",     posted_at: "2016-09-22T07:00:00.000000Z",     project_id: None,     task_id: "2995104339",     attachment: Attachment(         file_name: "File.pdf",         file_type: "application/pdf",         file_url: "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         resource_type: "file"     ) )`

`{     content: "Need one bottle of milk",     id: "2992679862",     postedAt: "2016-09-22T07:00:00.000000Z",     projectId: null,     taskId: "2995104339",     attachment: {         fileName: "File.pdf",         fileType: application/pdf,         fileUrl: "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         resourceType: "file"     } }`

#### Properties

Property

Description

id *String*

Comment ID.

task\_id *String*

Comment's task ID (will be `null` if the comment belongs to a project).

project\_id *String*

Comment's project ID (will be `null` if the comment belongs to a task).

posted\_at *String*

Date and time when comment was added, [RFC3339][44] format in UTC.

content *String*

Comment content. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the [Text Formatting article][45] in the Help Center.

attachment *Object*

Attachment file (will be `null` if there is no attachment).

The optional attachment attribute describes object with attachment metadata. Format of this object depends on the kind of attachment it describes, see [Sync API documentation for format details][46].

## Get all comments

&gt; Get all comments:

`$ curl "https://api.todoist.com/rest/v2/comments?task_id=2995104339" \   -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     comments = api.get_comments(task_id="2995104339")     print(comments) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getComments({ taskId: "2995104339" })     .then((comments) =&gt; console.log(comments))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`[     {         "content": "Need one bottle of milk",         "id": "2992679862",         "posted_at": "2016-09-22T07:00:00.000000Z",         "project_id": null,         "task_id": "2995104339",         "attachment": {             "file_name": "File.pdf",             "file_type": "application/pdf",             "file_url": "https://cdn-domain.tld/path/to/file.pdf",             "resource_type": "file"         }     } ]`

`[     Comment(         content: "Need one bottle of milk",         id: "2992679862",         posted_at: "2016-09-22T07:00:00.000000Z",         project_id: None,         task_id: "2995104339",         attachment: Attachment(             file_name: "File.pdf",             file_type: "application/pdf",             file_url: "https://cdn-domain.tld/path/to/file.pdf",             resource_type: "file"         )     ) ]`

`[     {         content: "Need one bottle of milk",         id: "2992679862",         postedAt: "2016-09-22T07:00:00.000000Z",         projectId: null,         taskId: "2995104339",         attachment: {             fileName: "File.pdf",             fileType: "application/pdf",             fileUrl: "https://cdn-domain.tld/path/to/file.pdf",             resourceType: "file"         }     } ]`

Returns a JSON-encoded array of all comments for a given `task_id` or `project_id`. Note that one of `task_id` or `project_id` arguments is required.

A successful response has `200 OK` status and `application/json` Content-Type.

#### Parameters

Parameter

Required

Description

project\_id *String*

Yes (or `task_id`)

ID of the project used to filter comments.

task\_id *String*

Yes (or `project_id`)

ID of the task used to filter comments.

## Create a new comment

&gt; Create a new comment:

`$ cat &gt; /tmp/note.json {     "task_id": "2995104339",     "content": "Need one bottle of milk",     "attachment": {         "resource_type": "file",         "file_url": "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         "file_type": "application/pdf",         "file_name": "File.pdf"     } } ^C  $ curl "https://api.todoist.com/rest/v2/comments" \     -X POST \     --data @/tmp/note.json \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     comment = api.add_comment(         content="Need one bottle of milk",         task_id="2995104339",         attachment={             "resource_type": "file",             "file_url": "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",             "file_type": "application/pdf",             "file_name": "File.pdf"         }     )     print(comment) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.addComment({     taskId: "2995104339",     content: "Need one bottle of milk",     attachment: {         resourceType: "file",         fileUrl: "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         fileType: "application/pdf",         fileName: "File.pdf",     }, })     .then((comment) =&gt; console.log(comment))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "content": "Need one bottle of milk",     "id": "2992679862",     "posted_at": "2016-09-22T07:00:00.000000Z",     "project_id": null,     "task_id": "2995104339",     "attachment": {         "file_name": "File.pdf",         "file_type": "application/pdf",         "file_url": "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         "resource_type": "file"     } }`

`Comment(     content: "Need one bottle of milk",     id: "2992679862",     posted_at: "2016-09-22T07:00:00.000000Z",     project_id: None,     task_id: "2995104339",     attachment: Attachment(         file_name: "File.pdf",         file_type: "application/pdf",         file_url: "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         resource_type: "file"     ) )`

`{     content: "Need one bottle of milk",     id: "2992679862",     postedAt: "2016-09-22T07:00:00.000000Z",     projectId: null,     taskId: "2995104339",     attachment: {         fileName: "File.pdf",         fileType: "application/pdf",         fileUrl: "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         resourceType: "file"     } }`

Creates a new comment on a project or task and returns it as a JSON object. Note that one of `task_id` or `project_id` arguments is required.

A successful response has `200 OK` status and `application/json` Content-Type.

#### JSON body parameters

Parameter

Required

Description

task\_id *String*

Yes (or `project_id`)

Comment's task ID (for task comments).

project\_id *String*

Yes (or `task_id`)

Comment's project ID (for project comments).

content *String*

Yes

Comment content. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the [Text Formatting article][47] in the Help Center.

attachment *Object*

No

Object for attachment object.

## Get a comment

&gt; Get a comment:

`$ curl "https://api.todoist.com/rest/v2/comments/2992679862" \   -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     comment = api.get_comment(comment_id="2992679862")     print(comment) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getComment("2992679862")     .then((comment) =&gt; console.log(comment))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "content": "Need one bottle of milk",     "id": "2992679862",     "posted_at": "2016-09-22T07:00:00.000000Z",     "project_id": null,     "task_id": "2995104339",     "attachment": {         "file_name": "File.pdf",         "file_type": "application/pdf",         "file_url": "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         "resource_type": "file"     } }`

`Comment(     content: "Need one bottle of milk",     id: "2992679862",     posted_at: "2016-09-22T07:00:00.000000Z",     project_id: None,     task_id: "2995104339",     attachment: Attachment(         file_name: "File.pdf",         file_type: "application/pdf",         file_url: "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         resource_type: "file"     ) )`

`{     content: "Need one bottle of milk",     id: "2992679862",     postedAt: "2016-09-22T07:00:00.000000Z",     projectId: null,     taskId: "2995104339",     attachment: {         fileName: "File.pdf",         fileType: "application/pdf",         fileUrl: "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         resourceType: "file"     } }`

Returns a single comment as a JSON object.

A successful response has `200 OK` status and `application/json` Content-Type.

## Update a comment

&gt; Update a comment:

`$ curl "https://api.todoist.com/rest/v2/comments/2992679862" \     -X POST \     --data '{"content": "Need two bottles of milk"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.update_comment(         comment_id="2995104339",          content="Need two bottles of milk"     )     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.updateComment("2995104339", { content: "Need two bottles of milk" })     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "content": "Need two bottles of milk",     "id": "2992679862",     "posted_at": "2016-09-22T07:00:00.000000Z",     "project_id": null,     "task_id": "2995104339",     "attachment": {         "file_name": "File.pdf",         "file_type": "application/pdf",         "file_url": "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         "resource_type": "file"     } }`

`Comment(     content: "Need one bottle of milk",     id: "2992679862",     posted_at: "2016-09-22T07:00:00.000000Z",     project_id: None,     task_id: "2995104339",     attachment: Attachment(         file_name: "File.pdf",         file_type: "application/pdf",         file_url: "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         resource_type: "file"     ) )`

`{     content: "Need one bottle of milk",     id: "2992679862",     postedAt: "2016-09-22T07:00:00.000000Z",     projectId: null,     taskId: "2995104339",     attachment: {         fileName: "File.pdf",         fileType: "application/pdf",         fileUrl: "https://s3.amazonaws.com/domorebetter/Todoist+Setup+Guide.pdf",         resourceType: "file"     } }`

Returns the updated comment as a JSON object.

A successful response has `200 OK` status and `application/json` Content-Type.

#### JSON body parameters

Parameter

Required

Description

content *String*

Yes

New content for the comment. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the [Text Formatting article][48] in the Help Center.

## Delete a comment

&gt; Delete a comment:

`$ curl -X DELETE "https://api.todoist.com/rest/v2/comments/2992679862" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.delete_comment(comment_id="2995104339")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.deleteComment("2995104339")     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Deletes a comment.

A successful response has `204 No Content` status and an empty body.

# Labels

&gt; An example personal label object:

`{     "id": "2156154810",     "name": "Food",     "color": "charcoal",     "order": 1,     "is_favorite": false }`

`Label(     id: "2156154810",     name: "Food",     color: "charcoal",     order: 1,     is_favorite: False )`

`{     id: "2156154810",     name: "Food",     color: "charcoal",     order: 1,     isFavorite: false }`

There are two types of labels that can be added to Todoist tasks. We refer to these as "personal" and "shared" labels.

#### Personal labels

Labels created by the current user will show up in their personal label list. These labels can be customized and will stay in their account unless deleted.

A personal label can be converted to a shared label by the user if they no longer require them to be stored against their account, but they still appear on shared tasks.

#### Shared labels

A label created by a collaborator that doesn’t share a name with an existing personal label will appear in our clients as a shared label. These labels are gray by default and will only stay in the shared labels list if there are any active tasks with this label.

A user can convert a shared label to a personal label at any time. The label will then become customizable and will remain in the account even if not assigned to any active tasks.

You can find more information on the differences between personal and shared labels in our [Help Center][49].

#### Properties (only applicable to personal labels)

Property

Description

id *String*

Label ID.

name *String*

Label name.

color *String*

The color of the label icon. Refer to the `name` column in the [Colors][50] guide for more info.

order *Integer*

Number used by clients to sort list of labels.

is\_favorite *Boolean*

Whether the label is a favorite (a `true` or `false` value).

## Get all personal labels

&gt; Get all personal labels:

`$ curl "https://api.todoist.com/rest/v2/labels" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     labels = api.get_labels()     print(labels) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getLabels()     .then((labels) =&gt; console.log(labels))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`[     {         "id": "2156154810",         "name": "Food",         "color": "charcoal",         "order": 1,         "is_favorite": false     }     ... ]`

`[     Label(         id: "2156154810",         name: "Food",         color: "charcoal",         order: 1,         is_favorite: False     ) ]`

`[     {         id: "2156154810",         name: "Food",         color: "charcoal",         order: 1,         isFavorite: false     } ]`

Returns a JSON-encoded array containing all user labels.

A successful response has `200 OK` status and `application/json` Content-Type.

## Create a new personal label

&gt; Create a new personal label:

`$ curl "https://api.todoist.com/rest/v2/labels" \     -X POST \     --data '{"name": "Food"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     label = api.add_label(name="Food")     print(label) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.addLabel({ name: "Food" })     .then((label) =&gt; console.log(label))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "id": "2156154810",     "name": "Food",     "color": "charcoal",     "order": 1,     "is_favorite": false }`

`Label(     id: "2156154810",     name: "Food",     color: "charcoal",     order: 1,     is_favorite: False )`

`{     id: "2156154810",     name: "Food",     color: "charcoal",     order: 1,     isFavorite: false }`

Creates a new personal label and returns its object as JSON.

A successful response has `200 OK` status and `application/json` Content-Type.

#### JSON body parameters

Parameter

Required

Description

name *String*

Yes

Name of the label.

order *Integer*

No

Label order.

color *String*

No

The color of the label icon. Refer to the `name` column in the [Colors][51] guide for more info.

is\_favorite *Boolean*

No

Whether the label is a favorite (a `true` or `false` value).

## Get a personal label

&gt; Get a personal label:

`$ curl "https://api.todoist.com/rest/v2/labels/2156154810" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     label = api.get_label(label_id="2156154810")     print(label) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getLabel("2156154810")     .then((label) =&gt; console.log(label))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "id": "2156154810",     "name": "Food",     "color": "charcoal",     "order": 1,     "is_favorite": false }`

`Label(     id: "2156154810",     name: "Food",     color: "charcoal",     order: 1,     is_favorite: False )`

`{     id: "2156154810",     name: "Food",     color: "charcoal",     order: 1,     isFavorite: false }`

Returns a personal label by ID.

A successful response has `200 OK` status and `application/json` Content-Type.

## Update a personal label

&gt; Update a personal label:

`$ curl "https://api.todoist.com/rest/v2/labels/2156154810" \     -X POST \     --data '{"name": "Drinks"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.update_label(label_id="2156154810", name="Drinks")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.updateLabel("2156154810", { name: "Drinks" })     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`{     "id": "2156154810",     "name": "Drinks",     "color": "charcoal",     "order": 1,     "is_favorite": false }`

`Label(     id: "2156154810",     name: "Drinks",     color: "charcoal",     order: 1,     is_favorite: False )`

`{     id: "2156154810",     name: "Drinks",     color: "charcoal",     order: 1,     isFavorite: false }`

Returns the updated label.

A successful response has `200 OK` status and `application/json` Content-Type.

#### JSON body parameters

Parameter

Required

Description

name *String*

No

New name of the label.

order *Integer*

No

Number that is used by clients to sort list of labels.

color *String*

No

The color of the label icon. Refer to the `name` column in the [Colors][52] guide for more info.

is\_favorite *Boolean*

No

Whether the label is a favorite (a `true` or `false` value).

## Delete a personal label

&gt; Delete a personal label:

`$ curl -X DELETE "https://api.todoist.com/rest/v2/labels/2156154810" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.delete_label(label_id="2156154810")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.deleteLabel("2156154810")     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Deletes a personal label. All instances of the label will be removed from tasks.

A successful response has `204 No Content` status and an empty body.

## Get all shared labels

&gt; Get all shared labels:

`$ curl "https://api.todoist.com/rest/v2/labels/shared" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     labels = api.get_shared_labels()     print(labels) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.getSharedLabels()     .then((labels) =&gt; console.log(labels))     .catch((error) =&gt; console.log(error))`

&gt; Example response:

`[     "Label1",     "Label2",     "Label3" ]`

`[     "Label1",     "Label2",     "Label3" ]`

`[     "Label1",     "Label2",     "Label3" ]`

Returns a JSON-encoded array containing the names of all labels currently assigned to tasks.

By default, the names of a user's [personal labels][53] will also be included. These can be excluded by passing the `omit_personal` parameter.

A successful response has `200 OK` status and `application/json` Content-Type.

Parameter

Required

Description

omit\_personal *Boolean*

No

Whether to exclude the names of the user's personal labels from the results. The default value is `false`.

## Rename shared labels

&gt; Rename shared labels:

`$ curl "https://api.todoist.com/rest/v2/labels/shared/rename" \     -X POST \     --data '{"name": "MyLabel", "new_name": "RenamedLabel"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.rename_shared_labels(name="MyLabel", new_name="RenamedLabel")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.renameSharedLabels({ name: "MyLabel", newName: "RenamedLabel" })     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Renames all instances of a shared label.

A successful response has `204 No Content` status and an empty body.

#### JSON body parameters

Parameter

Required

Description

name *String*

Yes

The name of the existing label to rename.

new\_name *String*

Yes

The new name for the label.

## Remove shared labels

&gt; Remove shared labels:

`$ curl "https://api.todoist.com/rest/v2/labels/shared/remove" \     -X POST \     --data '{"name": "MyLabel"}' \     -H "Content-Type: application/json" \     -H "X-Request-Id: $(uuidgen)" \     -H "Authorization: Bearer $token"`

`from todoist_api_python.api import TodoistAPI  api = TodoistAPI("0123456789abcdef0123456789")  try:     is_success = api.remove_shared_labels(name="MyLabel")     print(is_success) except Exception as error:     print(error)`

`import { TodoistApi } from "@doist/todoist-api-typescript"  const api = new TodoistApi("0123456789abcdef0123456789")  api.removeSharedLabels({ name: "MyLabel" })     .then((isSuccess) =&gt; console.log(isSuccess))     .catch((error) =&gt; console.log(error))`

&gt; The API returns an empty response with status 204. SDK clients will respond with `true` to indicate success.

Removes all instances of a shared label from the tasks where it is applied. If no instances of the label name are found, the request will still be considered successful.

A successful response has `204 No Content` status and an empty body.

#### JSON body parameters

Parameter

Required

Description

name *String*

Yes

The name of the label to remove.

# Request Limits

#### Payload Size

There is currently a 1 MiB HTTP request body limit on POST requests.

#### Header Size

Total size of HTTP headers cannot exceed 65 KiB.

#### Processing Timeouts

There is a processing timeout of 15 seconds on each request.

#### Rate Limiting

For each user, you can make a maximum of 1000 requests within a 15 minute period.

# Migrating from v1

Version 2 of the REST API builds upon version 1 with a number of modifications, here we'll list the changes and provide some information on migrating to the latest version.

#### General

-   All datetime strings returned by the API have microsecond precision (`2021-01-01T12:00:00.123456Z`). Any endpoints that have a datetime parameter will accept the value with or without the microseconds present (`2021-01-01T12:00:00.123456Z` or `2021-01-01T12:00:00Z`).
-   All ids are now strings, instead of numbers. Some of them may still contain only numbers, but it's not guaranteed it will continue to be that way. **All string ids must be treated as opaque byte sequences**.

#### Projects

-   The `id` attribute is now a string (was previously a number).
-   The `color` attribute is now a string representing the name of the color instead of a numeric ID. See the [colors guide][54] for details of the possible values.
-   The `sync_id` attribute has been removed.
-   The `parent` attribute has been renamed to `parent_id`. This will now always be returned and will return `null` if the project has no parent.
-   The `parent_id` attribute is now a string (was previously a number).
-   The `favorite` attribute has been renamed to `is_favorite`.
-   The `shared` attribute has been renamed to `is_shared`.
-   The `inbox_project` attribute has been renamed to `is_inbox_project`. This value will now always be returned.
-   The `team_inbox` attribute has been renamed to `is_team_inbox`. This value will now always be returned.
-   The `order` attribute will now always be returned. For unordered Inbox projects the value will be `0`.
-   Projects have a new property `view_style`. This value determines whether the Todoist clients display the project as a list or board. This value can be set with the [create project][55] or [update project][56] endpoints.
-   The **project update** endpoint returns the updated object instead of an empty response.

#### Tasks

-   The `id` attribute is now a string (was previously a number).
-   The `creator` attribute has been renamed to `creator_id`.
-   The `created` attribute has been renamed to `created_at`.
-   The `assignee` attribute has been renamed to `assignee_id`. This will now always be returned and will return `null` if no user is assigned.
-   The `assigner` property has been renamed to `assigner_id`. This will always be returned and will return `null` if the task has not been assigned.
-   The `parent` attribute has been renamed to `parent_id`. This will now always be returned and will return `null` if the task has no parent.
-   The `parent_id` attribute is now a string (was previously a number).
-   The `section_id` attribute will now return `null` if the task has no parent section.
-   The `section_id` attribute is now a string (was previously a number).
-   The `completed` attribute has been renamed to `is_completed`.
-   The `label_ids` attribute has been renamed to `labels` and now returns the [label][57] names instead of ids. The attribute is always returned and an empty array will be returned if there are no labels.
-   The `sync_id` attribute has been removed.
-   The `due` attribute will now always be returned. If no due date has been set it will be `null`.
-   The `recurring` attribute of due dates has been renamed to `is_recurring`.
-   The **task update** endpoint returns the updated object instead of an empty response.

#### Comments

-   The `id` attribute is now a string (was previously a number).
-   The `task_id` attribute will now always be returned. If the comment belongs to a project it will be `null`.
-   The `project_id` attribute will now always be returned. If the comment belongs to a task it will be `null`.
-   The `task_id` and `project_id` attributes are now strings when present (were previously numbers).
-   The `attachment` attribute will now always be returned. If there is no attachment for the comment it will be `null`.
-   The `posted` attribute has been renamed to `posted_at`.
-   The **comment update** endpoint returns the updated object instead of an empty response.

#### Labels

-   The `id` attribute is now a string (was previously a number).
-   The `color` attribute is now a string representing the name of the color instead of a numeric ID. See the [colors guide][58] for details of the possible values.
-   We introduced a new concept of "shared labels" to Todoist. These are labels that are not saved to a user's account but have been created by collaborators and appear on tasks. See the [labels][59] section for details of the differences between personal and shared labels.
-   New endpoints have been added to [get][60], [rename][61], and [remove][62] shared labels.
-   The `favorite` attribute has been renamed to `is_favorite`.
-   The **label update** endpoint returns the updated object instead of an empty response.

[1]: https://developer.todoist.com/
[2]: https://developer.todoist.com/guides/
[3]: https://developer.todoist.com/rest/
[4]: https://developer.todoist.com/sync/
[5]: https://developer.todoist.com/ui-extensions
[6]: https://developer.todoist.com/appconsole.html
[7]: https://developer.todoist.com/submissions.html
[8]: https://developer.todoist.com/sync/
[9]: https://developer.todoist.com/rest/v2/?python#getting-started
[10]: https://github.com/Doist/todoist-api-python
[11]: https://pypi.org/project/todoist-api-python/
[12]: https://developer.todoist.com/rest/v2/?javascript#getting-started
[13]: https://github.com/Doist/todoist-api-typescript
[14]: https://www.npmjs.com/package/@doist/todoist-api-typescript
[15]: https://www.npmjs.com/package/axios-case-converter
[16]: https://en.wikipedia.org/wiki/CURL
[17]: https://todoist.com/prefs/integrations
[18]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
[19]: https://developer.todoist.com/rest/v2/#request-and-response-format
[20]: https://developer.todoist.com/rest/v2/#projects
[21]: https://developer.todoist.com/rest/v2/#tasks
[22]: https://todoist.com/help/articles/due-dates-and-times
[23]: https://developer.todoist.com/guides/#authorization
[24]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
[25]: https://todoist.com/prefs/integrations
[26]: https://developer.todoist.com/guides/#authorization
[27]: https://developer.todoist.com/guides/#colors
[28]: https://developer.todoist.com/guides/#colors
[29]: https://developer.todoist.com/guides/#colors
[30]: https://todoist.com/help/articles/format-text-in-a-todoist-task-e5dHw9
[31]: https://todoist.com/help/articles/format-text-in-a-todoist-task-e5dHw9
[32]: https://todoist.com/help/articles/introduction-to-recurring-dates-YUYVJJAV
[33]: https://www.ietf.org/rfc/rfc3339.txt
[34]: https://todoist.com/help/articles/introduction-to-filters-V98wIH
[35]: https://todoist.com/help/articles/format-text-in-a-todoist-task-e5dHw9
[36]: https://todoist.com/help/articles/format-text-in-a-todoist-task-e5dHw9
[37]: https://todoist.com/help/articles/introduction-to-dates-and-time-q7VobO
[38]: https://www.ietf.org/rfc/rfc3339.txt
[39]: https://todoist.com/help/articles/format-text-in-a-todoist-task-e5dHw9
[40]: https://todoist.com/help/articles/format-text-in-a-todoist-task-e5dHw9
[41]: https://todoist.com/help/articles/introduction-to-dates-and-time-q7VobO
[42]: https://www.ietf.org/rfc/rfc3339.txt
[43]: https://todoist.com/help/articles/introduction-to-recurring-dates-YUYVJJAV
[44]: https://www.ietf.org/rfc/rfc3339.txt
[45]: https://todoist.com/help/articles/format-text-in-a-todoist-task-e5dHw9
[46]: https://developer.todoist.com/sync/v9/#uploads
[47]: https://todoist.com/help/articles/format-text-in-a-todoist-task-e5dHw9
[48]: https://todoist.com/help/articles/format-text-in-a-todoist-task-e5dHw9
[49]: https://todoist.com/help/articles/introduction-to-labels-dSo2eE#shared
[50]: https://developer.todoist.com/guides/#colors
[51]: https://developer.todoist.com/guides/#colors
[52]: https://developer.todoist.com/guides/#colors
[53]: https://developer.todoist.com/rest/v2/#labels
[54]: https://developer.todoist.com/guides/#colors
[55]: https://developer.todoist.com/rest/v2/#create-a-new-project
[56]: https://developer.todoist.com/rest/v2/#update-a-project
[57]: https://todoist.com/help/articles/introduction-to-labels-dSo2eE
[58]: https://developer.todoist.com/guides/#colors
[59]: https://developer.todoist.com/rest/v2/#labels
[60]: https://developer.todoist.com/rest/v2/#get-all-shared-labels
[61]: https://developer.todoist.com/rest/v2/#rename-shared-labels
[62]: https://developer.todoist.com/rest/v2/#remove-shared-labels