# Contributing to Focus Filter Extension

First off, thanks for taking the time to contribute! 🎉

Getting involved in open source is an amazing way to learn, inspire, and help others. Any contribution you make will be **greatly appreciated**.

## 🌟 Types of Contributions

We welcome many types of contributions:

- **Code**: Fix bugs, add new features, or improve performance.
- **Design**: Improve the UI/UX of the popup or blocked page.
- **Documentation**: Improve the README, developer guides, or add examples.
- **Testing**: Add more unit tests or edge cases to `tests/`.
- **Suggestions**: Open an issue to suggest new ideas or report bugs.

## 🛠 Development Workflow

### 1. Fork and Clone
Fork the repository to your own GitHub account and then clone it to your local device:
```bash
git clone https://github.com/YOUR_USERNAME/focus-filter-extension.git
cd focus-filter-extensions
```

### 2. Install Dependencies
Ensure you are using Node.js 22 (we have an `.nvmrc` file):
```bash
nvm use
npm install
```

### 3. Create a Branch
Create a new branch for your feature or bugfix:
```bash
git checkout -b feature/my-amazing-feature
# or
git checkout -b fix/annoying-bug
```

### 4. Develop & Test
Start the development server:
```bash
npm run dev
```
Make your changes. Ensure everything is working locally.
Run the tests to make sure you haven't broken anything:
```bash
npm test
```

### 5. Commit & Push
Commit your changes with a clear message:
```bash
git commit -m "feat: add pomodoro timer integration"
```
Push to your fork:
```bash
git push origin feature/my-amazing-feature
```

### 6. Open a Pull Request
Go to the original repository and open a Pull Request (PR) from your fork.

## 📐 Coding Standards

- **TypeScript**: We use strict TypeScript. Please type your code properly.
- **Tailwind**: Use utility classes for styling. Try to use the defined colors (e.g., `bg-background`, `text-primary`) to maintain Dark Mode compatibility.
- **Components**: We follow a "Shadcn-like" pattern in `components/ui`. Re-use existing components whenever possible.
- **Clean Code**: Keep functions small and focused (like `isUrlBlocked` in `lib/blocking.ts`).

## 🐞 Reporting Bugs

Bugs happen! If you find one, please open an issue and include:
- Your browser version.
- Steps to reproduce.
- What happened vs. what you expected to happen.

## 💡 Feature Requests

Have a cool idea? Open an issue with the "feature request" label!

---

**Happy Coding!** 🚀
