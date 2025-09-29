# Ji-Podhead - Next.js Portfolio

This is a personal portfolio website built with Next.js, React, and TypeScript. It showcases projects, skills, and professional experience in a modern, interactive, and visually appealing single-page application.

## Features

- **Modern Tech Stack:** Built with Next.js, React, and TypeScript for a robust and maintainable application.
- **Interactive Animations:** Features a "Matrix"-style animated background and interactive project demos powered by the custom `kooljs` animation library.
- **Modular Component-Based Architecture:** The UI is broken down into reusable React components for clean and organized code.
- **Custom React Hooks:** Animation logic is encapsulated in custom hooks, separating concerns and adhering to React best practices.
- **Responsive Design:** Styled with Tailwind CSS for a fully responsive layout that looks great on all devices.
- **Scroll-Triggered Animations:** Content sections fade in as the user scrolls, creating a dynamic and engaging user experience.

## Project Structure

The project is organized into the following main directories:

-   `src/app/`: Contains the main page (`page.tsx`) and layout (`layout.tsx`) of the application.
-   `src/components/`: Holds all the reusable React components, such as `Header`, `Hero`, `Projects`, `Skills`, and `Footer`.
-   `src/examples/`: Contains the custom React hooks (`useExample1.ts`, `useExample2.ts`, `useExample3.ts`) that encapsulate the logic for the interactive `kooljs` animations.
-   `src/lib/kooljs/`: Contains the `kooljs` animation library files, adapted to be used within the Next.js project.

## Getting Started

To run the project locally, follow these steps:

1.  **Navigate to the project directory:**
    ```bash
    cd portfolio-next
    ```

2.  **Install the dependencies:**
    This project uses `bun` as the package manager.
    ```bash
    bun install
    ```

3.  **Start the development server:**
    ```bash
    bun run dev
    ```

After running these commands, you can open your browser and navigate to `http://localhost:3000` to see the website.

---

*This project was developed in collaboration with the AI assistant Jules.*