# PDF Uploader Backend

This repository contains the backend code for a PDF uploader application. The backend is built using Node.js and Express, with MongoDB as the database.

## Packages Used

The following packages are used in this project:

- `bcryptjs`: ^2.4.3
- `cors`: ^2.8.5
- `dotenv`: ^16.4.5
- `express`: ^4.19.2
- `express-async-handler`: ^1.2.0
- `jsonwebtoken`: ^9.0.2
- `mongoose`: ^8.4.1
- `morgan`: ^1.10.0
- `multer`: ^1.4.5-lts.1
- `nodemon`: ^3.1.3

## Installation Instructions

Follow these steps to set up and run the backend on your local machine.

### Step 1: Clone the Repository

First, clone the backend app to your local repository:

```sh
git clone https://github.com/MevanWeerasinghe/pdf-uploader-backend.git
```

### Step 2: Navigate to the project directory:

Navigate to the app folder and open it in your preferred code editor.

### Step 3: Install the Packages

Install the necessary packages by running:

```sh
npm install
```

### Step 4: Create the 'uploads' Folder

Create a folder named 'uploads' in the root directory of the project:

pdf-uploader-backend/uploads

### Step 5: Create the .env File

Create a .env file in the root directory of the project and add the following variables:

```sh
CONNECTION_STRING=<MongoDB database/table connection string>
JWT_SECRET=<Your secret>
PORT=5000
```

### Running the Application

```sh
npm start
```



