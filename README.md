# Webcraft-Pro

Welcome to Webcraft-Pro, a comprehensive SaaS website builder, project management tool, and dashboard platform built using modern technologies like Next.js 14, Pnpm, Stripe Connect, Prisma, MySQL, and Tailwind CSS. This powerful application provides users with an all-in-one solution for creating, managing, and monetizing their web projects efficiently.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Website Builder**: Drag-and-drop interface to create stunning websites without coding.
- **Project Management**: Tools to manage tasks, milestones, and teams effectively.
- **Dashboard**: Comprehensive dashboard to monitor project progress and website analytics.
- **Stripe Integration**: Seamless payment processing and subscription management with Stripe Connect.
- **User Authentication**: Secure user authentication and authorization.
- **Responsive Design**: Fully responsive design with Tailwind CSS.
- **Database Management**: Robust database management with Prisma and MySQL.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS
- **Backend**: Pnpm
- **Database**: MySQL, Prisma
- **Payments**: Stripe Connect

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v16 or higher)
- Pnpm (v9.0 or higher)
- MySQL (v8 or higher)
- Stripe account

### Visit the app

Visit the app at - [Webcraft-Pro](https://webcraft-pro.vercel.app/)

### Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/yourusername/webcraft-pro.git
   cd webcraft-pro
   ```

2. **Install Dependencies**

   ```sh
   pnpm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/webcraft_pro"
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY="your_stripe_public_key"
   ```

4. **Migrate the Database**
   ```sh
   npx prisma migrate dev --name init
   ```

### Running the Project

1. **Start the Development Server**

   ```sh
   pnpm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Website Builder**: Use the intuitive drag-and-drop editor to create your website.
- **Project Management**: Create projects, assign tasks, and track progress.
- **Dashboard**: View analytics and manage your websites and projects from a single dashboard.
- **Payments**: Manage subscriptions and payments through Stripe.

## Project Structure

```
webcraft-pro/
├── prisma/              # Prisma schema and migrations
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Next.js pages
│   ├── styles/          # Tailwind CSS styles
│   ├── utils/           # Utility functions
│   └── ...              # Other directories and files
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## API Documentation

Detailed API documentation can be found [here](docs/api.md).

## Database Schema

The Prisma schema is defined in `prisma/schema.prisma`. Here is an overview:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Other fields...
}

model Project {
  id        Int      @id @default(autoincrement())
  name      String
  userId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Other fields...
}

model Website {
  id        Int      @id @default(autoincrement())
  projectId Int
  url       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Other fields...
}

model Payment {
  id        Int      @id @default(autoincrement())
  userId    Int
  amount    Float
  status    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Other fields...
}
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using Webcraft-Pro! If you have any questions or feedback, please feel free to contact us.
