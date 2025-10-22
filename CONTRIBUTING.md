# Contributing to MS8-Learning-Analytics

Thank you for your interest in contributing to MS8-Learning-Analytics! This document provides guidelines for contributing to our project.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Set up environment variables (see `.env.example` files)
4. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Pull Request Process

1. Ensure your code follows our style guidelines
2. Add tests for new functionality
3. Ensure all tests pass
4. Update documentation as needed
5. Submit your pull request with a clear description

## Coding Standards

- Use meaningful variable and function names
- Write clear, concise comments
- Follow the existing code style
- Write tests for new features
- Keep functions small and focused

## Commit Message Format

Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Testing

- Write unit tests for new features
- Ensure integration tests pass
- Test your changes across different browsers/devices

## Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, etc.)

## Questions?

If you have questions, please open an issue or reach out to the maintainers.
