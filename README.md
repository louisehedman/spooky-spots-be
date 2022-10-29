# SpookySpots

## **Find haunted places and talk about spooky stuff with others**

Explore haunted places (SpookySpots), learn about ghost types, possibility to save SpookySpots in your own list and of course a great community fullfills a ghost fan's every wish!

---

## **About this project**

This is a school assignment ninth for Fullstack Developer students at Chas Academy. The aim of the assignment was to go from an idea to a finished product with a code base in MERN-stack and TypeScript. The app's content is developed based on a user analysis, personas and user stories have their basis in the analysis. SpookySpots is the result. This is the backend part of the project. This backend is deployed at Render **link**


You find the frontend source code (React, TypeScript) [here](https://github.com/louisehedman/spooky-spots-fe) which is deployed at [Netlify](https://spookyspots.netlify.app/). Instructions for how to set up the frontend part of this project can be found in the frontend repo.

Before you clone and start this project make sure you have Node.js
installed and have a working local or hosted version of MongoDB.

---

## **Tech Stack**

**Server:** Node, Express, MongoDB, Mongoose, TypeScript, NodeMailer   
**Client:** React, TypeScript, Bootstrap 

---

## **Project setup**

After cloning this repo navigate to the root folder in your terminal.

#### **Note!**

ESlint will warn about types not found. This does not effect the app running properly in the browser. Disable the ESlint extension and reload VS Code. Don't worry, this project has its own customized linter. 

- Clone repo

- From the project root folder run command below to install the dependencies specified in `package.json`.

```bash
$ npm install  
```

- In the root folder create file `.env`.
- Add the following variables:

```env
PORT=<Choose your port>  // Express.js server
DB_URI=<Your MongoDB URI>
JWT_SECRET=<Secret string>
JWT_EXPIRE=<JWT token expiration time>
CLIENT_URL=<Url to client>
EMAIL_HOST=<SMTP for Outlook used in this project>
EMAIL_PORT=<Enter port for sending email>
EMAIL_USER=<Your email adress, from which emails will be sent>
EMAIL_PASS=<Your email password>
EMAIL_FROM=<Same as EMAIL_USER>

```

- Seed the database with SpookySpots, GhostTypes and CommunitySubjects data using the command:

```
$ npm run seed
```

This will first drop "spookyspots", "ghosttypes" and "communitysubjects" collections if they exist and then create them and insert documents for each SpookySpot, GhostType and CommunitySubject.

When the seeding is complete `Ctrl+C` in your terminal to close the server connection. 

For development, start the server again using Nodemon to automatically restart
the server on changes to `.ts` files with command:

```
$ npm run dev
```

To simply start the server without Nodemon, create dist folder and also install dependencies (makes life easier when deploying a TypeScript project on Render) use

```
$ npm start
```

## **API reference**

Full API documentation created with Insomnia is found here: [https://spookyspots-api.netlify.app/](<https://spookyspots-api.netlify.app/>)

---

## **Project structure**

## Server
Server.ts is where all the magic happens, database connection, routing and more, be sure to specify the port in `.env` and you can then start the server using one of the commands specified above. 

## Database
Here you find the connection to the database. DB_URI to MongoDB (local or in cloud) need to be specified in `.env`. 

## Models
The models available are User, Subscription, Newsletter, SpookySpot, SpookySpotListItem, GhostType, CommunitySubject, CommunityThread, Post and Comment. You can see their relation to each other in the ER diagram below. 

## Controllers
`The controllers available are`
- AuthController: Contains endpoints for register, login, logout, forgot password, reset password and authorization middleware.
- UserController: Endpoints to get signed in user, change email and password (while signed in). Also endpoints to get all users and one, update a user and delete a user (only admins have access to these).
- SpookySpotController: Endpoints to get all and one SpookySpot. Also endpoints to create and delete a SpookySpot (only admins have access). 
- SpookySpotListController: Endpoints related to the signed in users personal SpookySpotList.  
- NewsletterController: Endpoints to subscribe and unsubscribe to newsletter, send newsletter (only admins have access), get all and get one archived newsletters.  
`Community controllers below are restricted to signed in users`
- CommunitySubjectController: Endpoints to get all and one community subjects. Also an endpoint to create a subject (admin access only).
- CommunityThreadController: Endpoints to create a thread, get all threads within a subject, get one thread. 
- PostController: Endpoints to get all posts within a thread, get one post, create a post, edit a post (only author can edit) and delete a post (only author and admins can delete).
- CommentController: Endpoints to get all comments belonging to a post, create a comment, edit a comment (only author can edit) and delete a comment (only author and admins can delete).

## Routes
Here you find all the routes with connection to endpoints in controllers. They are divided into open (reachable for everyone) and protected (for signed in users/admins) sections with subgroups.

## Seeder
See description above in get started section. The seeder files are found in seeder folder, the seed command in `package.json` make the seed methods in `seeder.ts` run by getting called in `server.ts`. 

## Utils
Here you find setup for sending emails with NodeMailer in form of a reusable transporter, an subscribe to newsletter email validator and an error response helper. 

## ER diagram

<img src="https://user-images.githubusercontent.com/90186337/198668102-5bce9007-b9d1-49a8-ad57-668ff230581f.jpg" alt="ER diagram" width="100%">

---

## Documentation

- [Project idea](https://docs.google.com/document/d/1xlA0KhgWXEDwzU2vBi10hzIoo3GTTcoM4uRHSIlAMRo/edit?usp=sharing)
- [User analysis](https://docs.google.com/document/d/14jzJ80gSEh5xJ8M9CejJ5BoPfHvjv1ODgnNp2ICRifM/edit?usp=sharing)
- [Personas](https://docs.google.com/presentation/d/1vXBdDpWg93oUyjTk0OPy3TePZUFMP931PTgRTl7yLP0/edit?usp=sharing)
- [User stories](https://docs.google.com/document/d/1BDR_mWRZHppKYLYWMY7V96VUQ1t_vBZZHrExCKLeXRM/edit?usp=sharing)
- [Wireframes](<https://docs.google.com/document/d/1dHvbatFPZrLj2D7db1ZHIhfPU_jsDvV8MmIrfX-0hU8/edit?usp=sharing>)
- [Figma](<https://www.figma.com/file/10mZYkxzzgh3iFCNoKC1WU/U09-SpookySpots?node-id=0%3A1>)
- [Sitemap (frontend)](<https://docs.google.com/document/d/1pF7VYL4ZE50rU6XKTsq1u0SwSGDQJDSqxn-DVt6zFcM/edit?usp=sharing>)

---

## 👻 **Author**

Louise Hedman [@louisehedman](https://www.github.com/louisehedman)


## License

[MIT](https://choosealicense.com/licenses/mit/)
