# Contributing to Carbon Emissions Tracker

Thank you for considering contributing to the Carbon Emissions Tracker project! We welcome contributions from the community and are excited to work with you. Please follow these guidelines to ensure a smooth and effective collaboration.

## How to Contribute

### Reporting Issues

If you encounter any bugs, issues, or have feature requests, please open an issue on the GitHub repository. When reporting an issue, please include:

- A clear and descriptive title.
- A detailed description of the problem or suggestion.
- Steps to reproduce the issue (if applicable).
- Any relevant screenshots or code snippets.

### Forking the Repository

1. Fork the repository by clicking the "Fork" button on the top right of the repository page.
2. Clone your forked repository to your local machine:
   ~~~bash
   git clone https://github.com/yourusername/carbon-emissions-tracker.git
   ~~~
3. Navigate to the project directory:
   ~~~bash
   cd carbon-emissions-tracker
   ~~~

### Setting Up the Development Environment

1. Install root dependencies:
   ~~~bash
   npm install
   ~~~
2. Install client dependencies:
   ~~~bash
   cd client
   npm install
   ~~~
3. Set up environment variables:
   - In the `/server` directory, create a `.env` file and add:
     ~~~
     MONGODB_URI=your_mongo_connection_string
     JWT_SECRET=your_secret_key
     ~~~

### Making Changes

1. Create a new branch for your changes:
   ~~~bash
   git checkout -b feature/your-feature-name
   ~~~
2. Make your changes in the new branch.
3. Ensure your code follows the project's coding standards and conventions.
4. Write tests for your changes, if applicable.
5. Run tests to ensure everything works correctly:
   ~~~bash
   npm test
   ~~~

### Committing and Pushing Changes

1. Commit your changes with a clear and descriptive commit message:
   ~~~bash
   git commit -m "Add feature: your feature description"
   ~~~
2. Push your changes to your forked repository:
   ~~~bash
   git push origin feature/your-feature-name
   ~~~

### Submitting a Pull Request

1. Go to the original repository on GitHub and click the "New pull request" button.
2. Select the branch you created from your forked repository.
3. Provide a clear and descriptive title and description for your pull request.
4. Submit the pull request for review.

## Style Guide

- Follow the existing code style and conventions.
- Use meaningful variable and function names.
- Write clear and concise comments where necessary.
- Ensure your code is well-documented

Thank you for your contributions!
