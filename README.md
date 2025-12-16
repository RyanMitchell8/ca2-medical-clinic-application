# The Grand Medical Clinic

## Project Overview

The Grand Medical Clinic is a third-year continuous assessment project built with React (Vite). The front end is a component-driven admin app for managing:

- Doctors
- Appointments
- Patients
- Diagnoses
- Prescriptions

Data is consumed from a lecturer-provided REST API and displayed with a modern, responsive UI.

Live site: https://thegrandmedicalclinic.netlify.app

API docs: https://ca2-med-api.vercel.app/docs#tag/index

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Configuration & Theme](#configuration--theme)
- [Deployment](#deployment)
- [Credits & License](#credits--license)

---

## Features

- View lists of doctors, patients, appointments, diagnoses and prescriptions
- Create, edit and delete records
- Form validation with Zod + React Hook Form
- Responsive UI built with shadcn/ui + Tailwind CSS
- Token-based authentication for API access

## Tech Stack

- React (Vite)
- React Router
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui (component primitives)
- Netlify (hosting)

---

## Quick Start

Prerequisites: Node.js (LTS) and npm

1. Clone the repo and open it:

	```bash
	git clone <repo-url>
	cd ca2-medical-clinic-application
	```

2. Install dependencies:

	```bash
	npm install
	```

3. (Optional) Initialize shadcn UI (only needed if you want to re-run the UI setup):

	```bash
	npx shadcn@latest init
	```

4. Start the dev server:

	```bash
	npm run dev
	```

The app will be available at `http://localhost:5173` by default.

To build for production:

```bash
npm run build
```

---

## Configuration & Theme

- API base / client config: see `src/config/api.js`.
- Global CSS & color variables: `src/assets/globals.css`.

To change the site palette (primary, accent, charts, sidebar): update the CSS custom properties at the top of `src/assets/globals.css` — e.g. `--primary`, `--accent`, `--sidebar-accent`, and `--chart-1`.

Dark mode is controlled via the `html.dark` class (the file defines `html.dark` overrides). Toggle that class to preview the dark palette.

Recent UI notes:
- The green accent was switched to an orange accent (`--accent: #FB923C`).
- Back buttons were added to all Create/Edit pages for easier navigation.

---

## Deployment

This project is deployed on Netlify. To deploy yourself, connect the repository to Netlify and use the `npm run build` output directory.

Live site: https://thegrandmedicalclinic.netlify.app

---

## Credits & License

© 2024 Ryan Mitchell

This project was created for educational purposes as part of a third-year continuous assessment.