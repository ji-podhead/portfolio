# Ji-Podhead - Personal Portfolio

This is the personal portfolio website for **ji-podhead** (Head of MLOps / Lead AI & Security Architect).

🌐 **Live Demo:** [https://ji-podhead.github.io/portfolio/](https://ji-podhead.github.io/portfolio/)

## Features & Sections

- **`/cv`**: Executive Summary, Education (TU Berlin), and Engineering Highlights.
- **`/opensource`**: Core Open-Source Packages, Agentic Protocols, MCP Servers, and Frameworks.
- **`/projects`**: Ranked portfolio of public repositories evaluated across Tiers 1 to 4 with technical complexity, documentation, and contribution scores.
- **`/articles`**: Technical Guides (BIND9, Kea DHCP, DRBD HA, RHEL 9 Foreman), Protocols, and Research Notes.

## Tech Stack

- **Framework:** React / Next.js with TypeScript & Tailwind CSS.
- **Animations & Graphics:** Multithreaded `kooljs` engine, `@react-three/fiber`, Three.js, and custom WebGL / GLSL shaders.
- **CI/CD:** Automated deployment to GitHub Pages via `.github/workflows/deploy.yml`.

## Local Development

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Build production bundle:**
   ```bash
   npm run build
   ```
