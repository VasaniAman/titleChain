# titleChain
## About
titleChain is a Title Deed storing system that helps authenticate and store your title deeds. It is built with React.js, with a back end in MySQL, and aims to securely store your title deed in our system.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Login: Registered users can log in to the system using their email and password.

- Forgot Password: Users who forgot their password can initiate a password reset process. They receive a one-time password via email and 
  can use it to reset their password.

- Upload Title Deeds: Authenticated users can upload title deeds to the system. They select the file from their local device and provide 
  relevant details such as title deed information and associated parties.

- View Uploaded Title Deeds: Users can view a list of title deeds they have uploaded. The list displays basic information about each 
  Title Deed, such as title deed number, parties involved, and upload date.

- Edit Title Deeds: Users can edit the details of their uploaded title deeds, such as updating owner information or correcting any errors.

- Delete Title Deeds: Users can delete title deeds they have uploaded. This action permanently removes the title deed from the system.

- Verification Process: There is a verification process for uploaded title deeds. Admin users or authorized personnel review the uploaded title deeds and verify their authenticity. Once verified, the title deeds receive a verification status.

## Installation

### Prerequisites

Before you begin, ensure that you have the following installed on your system:

- MySQL: Install and set up a MySQL server on your machine. You can download MySQL Community Server from the official MySQL website.

### Step 1: Clone the Repository

1. Open a terminal or command prompt.

2. Change the current working directory to the location where you want to clone the project.

3. Run the following command to clone the repository:

Replace `https://github.com/VasaniAman/titleChain.git` with the URL of your project repository.

### Step 2: Install Dependencies

1. Navigate to the project directory:
2. Run npm install in the `server`
3. Run npm install in the `FrontEnd`
   
### Step 3: Configure the Database

1. Open the `server.js` file in a text editor.

2. Locate the `db` variable declaration and update it with your MySQL database connection details (host, user, password, and database).


### Step 4: Run the project
1. Run an "npm run start" in the server.js file
2. Run an "npm start" in the FrontEnd file.

## Contributing

Contributions are welcome! If you'd like to contribute to titleChain, please follow these steps:

1. make a fork request to the main project
2. email us at: jsehmi246@gmail.com, aman.vasani@strathmore.edu

## License

Done by: 146254 Singh Sehmi, 144914 Aman Vasani


