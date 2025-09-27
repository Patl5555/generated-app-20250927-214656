# Context Architect: Visual MCP Server Builder

[cloudflarebutton]

Context Architect is a sophisticated, visually-driven web application designed to dramatically simplify the creation, configuration, and deployment of Model Context Protocol (MCP) servers. Built on Cloudflare's serverless infrastructure, it provides developers with an elegant, intuitive interface to architect the context for AI agents without needing deep expertise in the underlying protocols. The application is centered around a powerful visual tool builder that offers real-time code generation, schema validation, and interactive guidance.

## ✨ Key Features

*   **Modern, Colorful Interface**: A beautiful dark theme with a vibrant violet-to-blue gradient, card-based layouts, and subtle animations.
*   **Visual Tool Builder**: An intuitive form-based interface for defining tool parameters with a real-time code generation preview.
*   **Core MCP Components**: Dedicated sections for managing Tools, Resources, and Prompts to structure AI agent context.
*   **Developer-Friendly**: Includes features like simulated live debugging, code snippet generation, and integrated deployment configuration.
*   **Interactive Guidance**: An integrated user manual and contextual tooltips to help users understand MCP concepts.
*   **Fully Responsive**: A flawless grid-based layout that adapts perfectly to all screen sizes.
*   **Built on Cloudflare**: Leverages the power and scalability of Cloudflare Workers for serverless deployment.

## 🚀 Technology Stack

*   **Frontend**: React, Vite, TypeScript, Tailwind CSS
*   **UI Components**: shadcn/ui, Framer Motion, Lucide React
*   **State Management**: Zustand with Immer
*   **Backend**: Cloudflare Workers, Hono
*   **Drag & Drop**: @dnd-kit
*   **Package Manager**: Bun

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd context_architect
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.dev.vars` file in the root of the project for local development. This file is used by Wrangler to inject secrets into your worker locally.
    ```
    # .dev.vars

    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```
    Replace the placeholder values with your actual Cloudflare AI Gateway details.

## 💻 Development

To start the local development server, which includes both the Vite frontend and the Cloudflare Worker backend, run:

```bash
bun dev
```

This will start the application, typically available at `http://localhost:3000`. The frontend will automatically reload as you make changes to the source files.

## ☁️ Deployment

This project is designed for easy deployment to the Cloudflare global network.

1.  **Login to Cloudflare:**
    If you haven't already, authenticate Wrangler with your Cloudflare account.
    ```bash
    bunx wrangler login
    ```

2.  **Configure Production Secrets:**
    For your deployed application, you must set secrets directly in the Cloudflare dashboard or via the command line. They will not be read from the `.dev.vars` file.
    ```bash
    bunx wrangler secret put CF_AI_API_KEY
    bunx wrangler secret put CF_AI_BASE_URL
    ```

3.  **Deploy the application:**
    Run the deploy script to build the application and deploy it to your Cloudflare account.
    ```bash
    bun deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[cloudflarebutton]

## 📂 Project Structure

*   `src/`: Contains all the frontend React application code.
    *   `components/`: Reusable UI components.
    *   `pages/`: Top-level page components for different routes.
    *   `store/`: Zustand state management stores.
    *   `lib/`: Utility functions.
*   `worker/`: Contains the Cloudflare Worker backend code (Hono server, agent logic, etc.).
*   `public/`: Static assets that are served directly.
*   `wrangler.jsonc`: Configuration file for the Cloudflare Worker.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.