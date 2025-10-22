# Branch Protection Configuration
# This file documents the recommended branch protection settings for the MS8-Learning-Analytics repository

## 🛡️ Branch Protection Rules

### Main Branch (master/main)
- **Require pull request reviews**: 1 reviewer minimum
- **Dismiss stale reviews**: Yes
- **Require status checks**: Yes
- **Required status checks**: 
  - frontend (CI/CD pipeline)
  - backend (CI/CD pipeline)
  - database (CI/CD pipeline)
  - security (CI/CD pipeline)
- **Require branches to be up to date**: Yes
- **Restrict pushes**: Yes (only via pull requests)
- **Allow force pushes**: No
- **Allow deletions**: No

### Development Branch (develop)
- **Require pull request reviews**: 1 reviewer minimum
- **Dismiss stale reviews**: Yes
- **Require status checks**: Yes
- **Required status checks**: 
  - frontend (CI/CD pipeline)
  - backend (CI/CD pipeline)
  - database (CI/CD pipeline)
- **Require branches to be up to date**: Yes
- **Restrict pushes**: Yes (only via pull requests)
- **Allow force pushes**: No
- **Allow deletions**: No

## 🔧 Implementation Steps

1. Go to GitHub repository Settings
2. Navigate to "Branches" section
3. Click "Add rule" for each branch
4. Configure the settings as specified above
5. Save the branch protection rules

## 📋 Additional Security Settings

- **Require signed commits**: Recommended for production
- **Require linear history**: Recommended for clean git history
- **Include administrators**: Yes (apply rules to admins too)
- **Allow specified actors to bypass**: No (unless necessary for CI/CD)

## 🚀 CI/CD Integration

The branch protection rules work in conjunction with the CI/CD pipeline defined in `.github/workflows/ci-cd.yml` to ensure:
- All code changes go through automated testing
- Security checks are performed on every pull request
- Build artifacts are generated and validated
- Deployment status is tracked and reported

## ⚠️ Important Notes

- These settings should be configured in the GitHub repository settings
- Branch protection rules are essential for maintaining code quality
- The CI/CD pipeline must pass before any merge is allowed
- Consider adding additional security measures based on project requirements
