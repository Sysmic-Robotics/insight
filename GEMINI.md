# CondorSSL Insight

This document provides a brief overview of the CondorSSL Insight project, its technologies, and how to get it running.

## Description

CondorSSL Insight is a desktop application built with Electron and React that serves as a graphical user interface for the CondorSSL simulation environment. It allows for real-time visualization of the game field, robot and ball positions, and provides tools for debugging and interacting with the simulation.

## Technologies Used

-   **Electron:** For creating the cross-platform desktop application.
-   **React:** For building the user interface.
-   **TypeScript:** For static typing and improved developer experience.
-   **Vite:** As the build tool and development server for the React application.
-   **HeroUI:** For styling the application.
-   **Redux Toolkit:** For state management.

## Getting Started

### Prerequisites

-   Node.js and npm installed.

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To run the application in development mode:

```bash
npm run dev
```

This will start the Vite development server for the React application and launch the Electron app.

### Building the Application

To build the application for production:

1.  Build the React application:
    ```bash
    npm run build
    ```
2.  Build the Electron application:
    ```bash
    npm run dist
    ```

This will create a distributable installer for your operating system in the `release` directory.
