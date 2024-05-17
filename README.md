# Module-Login

Module-Login is a web application that allows users to reset their password using OTP (One Time Password). The application uses Node.js, Express.js, and MongoDB for the backend. It uses bcrypt for password hashing and OTP for password reset functionality.

## Features

- User authentication
- Password reset via OTP
- Secure password storage using bcrypt

## How it works

When a user requests a password reset, the system generates an OTP and associates it with the user's account. The OTP is valid for a certain period. The user enters the OTP and their new password. If the OTP is valid, the system hashes the new password and replaces the old password with the new hashed password. The OTP is then deleted from the system.

## Installation

1. Clone the repository: `git clone (https://github.com/nuttooo/module-login.git)`
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the root directory of your project and add the following environment variables:

```shellscript
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
EMAIL_FROM=<your-email>
EMAIL_USER=<your-email-username>
EMAIL_PASS=<your-email-password>
EMAIL_HOST=<your-email-host>
EMAIL_PORT=<your-email-port>
EMAIL_SECURE=<true-or-false>
LOGO_URL=<your-logo-url>
NEXT_PUBLIC_BASE_URL=<your-base-url>
```

4. Start the server: `npm run dev`

This step instructs the user to create a `.env.local` file and add the necessary environment variables.

## Usage

1. After you have installed the project, you can start using it by running the command `npm run dev`.
2. The project will start running at `http://localhost:3000`.
3. You can test the various features of the project as specified in the Features section.

## Environment Variables

The project uses the following environment variables:

- `MONGODB_URI`: This is the URI for your MongoDB database.
- `JWT_SECRET`: This is a secret key used for signing and verifying JWT tokens for user authentication.
- `EMAIL_FROM`: This is the email address that will be used as the sender's address when sending emails.
- `EMAIL_USER`: This is the username for the email account that will be used to send emails.
- `EMAIL_PASS`: This is the password for the email account that will be used to send emails.
- `EMAIL_HOST`: This is the host of your email service provider.
- `EMAIL_PORT`: This is the port used by your email service provider.
- `EMAIL_SECURE`: This is a boolean value that determines whether to use a secure connection when sending emails.
- `LOGO_URL`: This is the URL of the logo that will be used in the emails.
- `NEXT_PUBLIC_BASE_URL`: This is the base URL of your application.

Please replace the placeholders with your actual data and save this file as `.env.local` in the root directory of your project.

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the terms of the MIT license. For more information, please see the [LICENSE](LICENSE) file.
