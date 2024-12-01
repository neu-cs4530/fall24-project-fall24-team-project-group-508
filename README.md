# Husky404

## Group 508

Our enhanced FakeStackOverflow project incorporates three major updates designed to improve functionality and user experience: a Markdown Text Editor with LaTeX support, a secure Single Sign-On (SSO) login system, and enhanced accessibility options. These features collectively elevate the platform by enabling professional content formatting, providing robust accessibility tools, and ensuring user account security. Users can now format posts with live previews, access tools to improve readability, and securely manage their profiles and activity.

The Markdown Editor with LaTeX Support allows users to format their posts professionally using markdown syntax like #, *, and '''. Mathematical expressions can also be added using LaTeX syntax with $ and previewed in real time, enabling more polished and versatile content creation.

The SSO Login and Authentication system enhances security and user management. Users can log in securely with an email and password, and their accounts store profile details and activity logs. The system supports multiple user roles, including standard users, moderators, and owners. Moderators have additional privileges, such as pinning, locking, and deleting all types of posts, while owners can manage accounts by searching for users and assigning roles.

The Accessibility Enhancements provide users with various customization options, such as toggling between dark and light modes, adjusting font sizes and weights, and enabling a screen reader for improved usability. Additionally, our web app is compatible with the user’s machine built in screen reader (i.e. iOS’s VoiceOver). These settings are stored for logged-in users, ensuring that customizations persist across sessions and devices.

## Setup

To build and interact with our updated FakeStackOverflow, first, clone the project repository using the following link: [FakeStackOverflow GitHub Repository](https://github.com/neu-cs4530/fall24-project-fall24-team-project-group-508/tree/Development). After cloning, navigate to the server, client, and testing directories sequentially and install the required dependencies by running npm install in each folder.
Next, create a .env file in the server directory and add the following variables:
MONGODB_URI=mongodb+srv://descoteauxa:03ssG0OcLftf31wo@db-cs4530-f24-508.pzdc8.mongodb.net  
CLIENT_URL=http://localhost:3000  
PORT=8000  
Additionally, for local hosting, create a .env file in the client directory with the line:
REACT_APP_SERVER_URL=http://localhost:8000 

Navigate to server/app.ts can replace line 24 (const CLIENT_URL = process.env.CLIENT_URL || 'https://cs4530-f24-508.onrender.com';) with const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

Once the environment is set up, start the server by running npx ts-node server/server.ts from the base directory. Then, navigate to the client folder and run npm run start to launch the client. The application will be accessible in your browser at http://localhost:3000.

## Deployed Site

The fully deployed version of Husky404 can be accessed at the following URL: [FakeStackOverflow DeployedVersion.](https://cs4530-f24-508.onrender.com)

## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](508diagram.png)
