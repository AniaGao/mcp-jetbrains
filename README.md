# mcp-jetbrains

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/<your_github_username>/mcp-jetbrains/actions/workflows/node.js.yml/badge.svg)](https://github.com/<your_github_username>/mcp-jetbrains/actions/workflows/node.js.yml)
<!-- Replace <your_github_username> with your actual GitHub username/organization -->

## Project Overview

### Brief Description

The 'mcp-jetbrains' project is a proxy server designed to intercept and potentially modify network requests between a JetBrains IDE and a backend service. It facilitates monitoring, modification, and control of communication between the IDE and its backend, providing a powerful tool for debugging, testing, and simulating various network conditions.

### Key Features

*   **Request Forwarding:** Transparently forwards requests from the IDE to the specified target URL.
*   **Interception & Modification:** Allows intercepting and modifying both incoming requests and outgoing responses using configurable middleware.
*   **Logging:** Provides comprehensive logging of all network traffic, including request and response headers and bodies.
*   **Configuration:** Offers flexible configuration options for customizing the proxy's behavior, including setting the target URL and defining interception rules.
*   **Asynchronous Processing:** Uses asynchronous processing for logging and other non-critical tasks to minimize performance impact.

### Project Goals

*   Provide a robust and reliable proxy server for JetBrains IDEs.
*   Enable developers to easily monitor and manipulate network traffic between the IDE and backend services.
*   Support various use cases, including debugging, testing, performance analysis, and security auditing.
*   Offer a flexible and extensible architecture that can be easily adapted to specific needs.

## Installation

### Prerequisites

*   **Node.js:**  Version 16.x or higher is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm:**  Should come bundled with Node.js. Verify its installation with `npm -v`.
*   **TypeScript:** Globally installed, use `npm install -g typescript`.

### Installation Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/<your_github_username>/mcp-jetbrains.git
    cd mcp-jetbrains
    ```
    <!-- Replace <your_github_username> with your actual GitHub username/organization -->

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Compile TypeScript:**

    ```bash
    npm run build
    ```

## Usage

### Basic Usage

1.  **Configure the proxy:**
    Edit the `src/config/config.ts` file to set the `targetUrl` to the address of the backend service you want to proxy. You can also configure other settings as needed. See the 'Configuration' section below for more details.

2.  **Start the proxy server:**

    ```bash
    npm start
    ```

    This will start the proxy server on the default port (usually 3000).

3.  **Configure your JetBrains IDE:**
    In your JetBrains IDE (e.g., IntelliJ IDEA, PyCharm), configure the HTTP proxy settings to use the address `localhost` and the port the proxy server is running on (default is 3000).  Consult your IDE documentation for specific instructions on setting up an HTTP proxy.

### Configuration

The proxy server's behavior is configured through the `src/config/config.ts` file. The following configuration options are available:

*   **`targetUrl` (string):** The URL of the backend service to which the proxy will forward requests. *Required*.
*   **`port` (number):** The port on which the proxy server will listen for incoming requests. Defaults to `3000`.
*   **`enableRequestLogging` (boolean):** Whether to enable logging of incoming requests. Defaults to `true`.
*   **`enableResponseLogging` (boolean):** Whether to enable logging of outgoing responses. Defaults to `true`.
*   **`interceptionRules` (array):** An array of rules that define how requests and responses should be intercepted and modified. (Further details on the format of this array would be added dependent on the interceptor implementation.)

Example `config.ts`:

```typescript
// src/config/config.ts
const config = {
    targetUrl: 'https://example.com/api',
    port: 3000,
    enableRequestLogging: true,
    enableResponseLogging: true,
    interceptionRules: [] // Example, may require more specification based on the 'interceptor.ts' behavior
};

export default config;
```

### Examples

*   **Logging all requests:** Start the proxy with `enableRequestLogging` and `enableResponseLogging` set to `true` in the configuration. All requests and responses will be logged to the console.

*   **Modifying a specific request header:** Implement an interception rule in `src/middleware/interceptor.ts` that modifies a specific request header based on a condition. Customize the `interceptionRules` to target specific API endpoints.

## Project Structure

### Directory Structure

```
mcp-jetbrains/
├── src/
│   ├── core/
│   │   └── proxy.ts
│   ├── middleware/
│   │   ├── request-logger.ts
│   │   ├── response-logger.ts
│   │   └── interceptor.ts
│   ├── config/
│   │   └── config.ts
│   ├── utils/
│   │   └── error-handler.ts
│   └── index.ts
├── tests/
│   └── ... (Unit tests)
├── scripts/
│   └── ... (Development, build, and deployment scripts)
├── docs/
│   └── ... (Project documentation)
├── package.json
├── tsconfig.json
└── README.md
```

### Key Files and Their Purposes

*   **`src/core/proxy.ts`:** Contains the main proxy server logic, including request handling and forwarding.
*   **`src/middleware/request-logger.ts`:** Middleware for logging incoming requests, including headers and body (if enabled).
*   **`src/middleware/response-logger.ts`:** Middleware for logging outgoing responses, including headers and body (if enabled).
*   **`src/middleware/interceptor.ts`:** Middleware for intercepting and potentially modifying requests and responses based on configured rules.  This is the core of the manipulation functionality.
*   **`src/config/config.ts`:** Configuration management module that defines the proxy's settings, such as the target URL and logging options.
*   **`src/utils/error-handler.ts`:** Centralized error handling mechanism for catching and logging errors.
*   **`package.json`:**  Defines project dependencies and metadata, including build and test scripts.
*   **`tsconfig.json`:** TypeScript compiler configuration file that specifies how TypeScript code should be compiled into JavaScript.

## Development

### Development Setup

1.  **Install dependencies:**  As detailed in the Installation section above (`npm install`).

2.  **Start the development server:**

    ```bash
    npm run dev  // Often uses a tool like nodemon for auto-reloading
    ```
    This command likely uses `nodemon` to automatically restart the server whenever code changes are detected. Configure your IDE to attach a debugger to the running process.

### Contributing Guidelines

1.  **Fork the repository:** Create your own fork of the repository on GitHub.

2.  **Create a branch:**  Create a new branch for your feature or bug fix.  Use descriptive branch names (e.g., `feature/add-request-header`, `bugfix/fix-logging-error`).

3.  **Make changes:** Implement your changes and ensure they are well-tested.

4.  **Write tests:**  Write unit tests to verify that your changes are working correctly. Place them in the `tests` directory.

5.  **Run tests:**

    ```bash
    npm test
    ```
    Ensure all tests pass before submitting a pull request.

6.  **Commit changes:** Commit your changes with clear and concise commit messages.

7.  **Push to your fork:** Push your branch to your forked repository on GitHub.

8.  **Create a pull request:**  Submit a pull request from your branch to the main branch of the original repository.  Provide a detailed description of your changes in the pull request.

9.  **Code review:**  Your pull request will be reviewed by project maintainers. Address any feedback and make necessary changes.

10. **Merge:** Once your pull request is approved and passes all checks, it will be merged into the main branch.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

*   This project utilizes dependencies from the open-source community, specifically focusing on Node.js and TypeScript packages, improving developer efficiency and expanding project functionalities.