# module-login
This project is a web application that allows users to reset their password using OTP (One Time Password). The application uses Node.js, Express.js, and MongoDB for the backend. It uses bcrypt for password hashing and OTP for password reset functionality.

## Features

- User authentication
- Password reset via OTP
- Secure password storage using bcrypt

## How it works

When a user requests a password reset, the system generates an OTP and associates it with the user's account. The OTP is valid for a certain period. The user enters the OTP and their new password. If the OTP is valid, the system hashes the new password and replaces the old password with the new hashed password. The OTP is then deleted from the system.

## Installation

1. Clone the repository: `git clone (https://github.com/nuttooo/module-login.git)`
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## Usage

1. After you have installed the project, you can start using it by running the command `npm start`.
2. The project will start running at `http://localhost:3000`.
3. You can test the various features of the project as specified in the Features section.

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the terms of the MIT license. For more information, please see the [LICENSE](LICENSE) file.
