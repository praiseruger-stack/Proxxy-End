# Proxxy

A polished three-page marketing and contact website for Proxxy, built with Express and static HTML, CSS, and JavaScript.

## Features

- Responsive landing page, about services page, and contact page
- Modern styling with strong contrast and visual hierarchy
- Mobile-friendly navigation menu
- Real contact form validation with backend processing
- Node.js + Express API that stores each submission in a JSON file
- Clean, ready-to-run project structure

## Project structure

```text
Proxxy/
├── data/
│   └── submissions.json
├── public/
│   ├── about.html
│   ├── contact.html
│   ├── index.html
│   ├── script.js
│   └── style.css
├── package.json
├── README.md
├── server.js
└── .gitignore
```

## Installation

From the project root, run:

```bash
npm install
```

## Run locally

```bash
npm start
```

Then open:

- http://localhost:3000/
- http://localhost:3000/about
- http://localhost:3000/contact

## Contact details

The contact page displays the required details exactly as provided:

- Email: praiseruger@gmail.com
- Phone: +234 (816-2452-779)

## Form backend behavior

The contact form posts to `/api/contact` and validates the request before storing it in `data/submissions.json`.

Successful submissions return a success message and the data is saved. Invalid requests return a clear error response with validation details.
