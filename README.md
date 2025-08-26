# 📘 Reexarizer – Automatic Text Summarization App

Reexarizer is a web-based **AI-powered text summarization tool** built with **Next.js, TypeScript, TailwindCSS, DaisyUI**, and powered by **IBM Granite via Replicate API**.  
It helps you quickly generate clean and concise summaries from long texts — in **English** and **Indonesian**.
🌐 **Live Demo:** [Reexarizer on Vercel](https://reexarizer-automatic-text-summariza.vercel.app/)

---

## ✨ Features

* 📝 **Summarization Modes**

  * Paragraph summarization
  * Bullet-point summarization

* 🔑 **Keyword Extraction**

  * Auto-extracted keywords with toggle (include/exclude)

* 📂 **File Upload**

  * Supports `.doc`, `.docx`, `.txt`
  * Works with **English** and **Indonesian** text

* 💾 **History**

  * Stores up to **10 recent summaries**
  * Viewable and re-downloadable anytime

* 📥 **Export & Download**

  * Download your summary in **.txt format**

* ⚡ **Custom Prompt (Optional)**

  * Add your own instructions for tailored summarization

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript  
- **Styling**: TailwindCSS + DaisyUI  
- **Backend API**: Next.js API Routes  
- **AI Model**: [IBM Granite on Replicate](https://replicate.com/ibm-granite/granite-3.3-8b-instruct)  
- **File Parsing**: `mammoth` (DOCX), native FS (TXT)  
- **Language Detection**: `franc-min`, `langs`  

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/aurllyc/Reexarizer-Automatic-Text-Summarization-Website/
cd Reexarizer
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file **.env.local** di root project, lalu isi dengan token Replicate kamu:

```bash
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

### 4. Run Development Server

```bash
npm run dev
```


## Final Steps

There are a few final steps that we were not able to perform automatically. We have provided a complete list for you below. You should take care of these before you can start developing your project. You can delete each item from the list as you go along.

### To do:

- Integrate Vercel with your repository host for continuous deployments at https://vercel.com/new

## Scripts

The table below provides names and descriptions of the npm scripts available in this project.

Each script is run using `npm run <script-name>`. For example: `npm run dev`.

| Name            | Description                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| `test`          | Runs tests                                                                     |
| `dev`           | Runs the Next.js development server.                                           |
| `build`         | Generates a production build.                                                  |
| `start`         | Runs the Next.js production server built using `build` script.                 |
| `lint`          | Runs [ESLint](https://eslint.org/) to catch linting errors in the source code. |
| `format`        | Formats all source code in the project.                                        |
| `format:check`  | Checks the formatting of all code in the project.                              |
| `deploy:vercel` | Deploy a preview deployment to Vercel                                          |

## Technologies

The table below gives an overview of the technologies used in this project, as well as places to learn more about them.

| Name            | Links                                                                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js         | [Website](https://nextjs.org/) - [Docs](https://nextjs.org/docs) - [Learn Next.js](https://nextjs.org/learn) - [GitHub](https://github.com/vercel/next.js) - [Wikipedia](https://en.wikipedia.org/wiki/Next.js) |
| React           | [Website](https://reactjs.org/) - [Docs](https://reactjs.org/docs/getting-started.html) - [GitHub](https://github.com/facebook/react) - [Wikipedia](<https://en.wikipedia.org/wiki/React_(JavaScript_library)>) |
| TypeScript      | [Website](https://www.typescriptlang.org/) - [Docs](https://www.typescriptlang.org/docs/) - [GitHub](https://github.com/microsoft/TypeScript) - [Wikipedia](https://en.wikipedia.org/wiki/TypeScript)           |
| Tailwind CSS    | [Website](https://tailwindcss.com/) - [Docs](https://tailwindcss.com/docs) - [GitHub](https://github.com/tailwindlabs/tailwindcss)                                                                              |
| Framer Motion   | [Website](https://www.framer.com/motion/) - [Docs](https://www.framer.com/docs/) - [GitHub](https://github.com/framer/motion)                                                                                   |
| React Hook Form | [Website](https://react-hook-form.com/) - [Docs](https://react-hook-form.com/get-started) - [GitHub](https://github.com/react-hook-form/react-hook-form)                                                        |
| React Query     | [Website](https://tanstack.com/query/latest) - [Docs](https://tanstack.com/query/latest/docs/react/overview) - [GitHub](https://github.com/tanstack/query)                                                      |
| React Icons     | [Website](https://react-icons.github.io/react-icons/) - [GitHub](https://github.com/react-icons/react-icons)                                                                                                    |
| ESLint          | [Website](https://eslint.org/) - [Configuration](https://eslint.org/docs/user-guide/configuring/) - [Rules](https://eslint.org/docs/rules/) - [GitHub](https://github.com/eslint/eslint)                        |
| Prettier        | [Website](https://prettier.io/) - [Docs](https://prettier.io/docs/en/index.html) - [Options](https://prettier.io/docs/en/options.html) - [GitHub](https://github.com/prettier/prettier)                         |
| npm             | [Website](https://www.npmjs.com/) - [Docs](https://docs.npmjs.com/) - [GitHub](https://github.com/npm/cli)                                                                                                      |
| GitHub Actions  | [Website](https://github.com/features/actions) - [Docs](https://docs.github.com/en/actions) - [Workflow syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)                |
| Vercel          | [Website](https://vercel.com/) - [Docs](https://vercel.com/docs) - [CLI Docs](https://vercel.com/docs/cli)                                                                                                      |
