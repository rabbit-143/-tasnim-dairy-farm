# 🌿 Git Workflow - Tasnim Dairy Farm

**Version**: 2.0.0  
**Purpose**: Standardized Git practices and workflows  
**Scope**: All code changes, branching, merging, and releases

---

## 🎯 Git Philosophy

**Git is not just version control—it's project history.** Every commit tells a story:
- What changed
- Why it changed
- Who changed it
- When it changed

**Good Git practices enable**:
- Easy code reviews
- Fast bug identification
- Safe rollbacks
- Clear project history
- Team collaboration

---

## 🌿 Branch Strategy

### **Branch Types**

```yaml
Main_Branches:
  main:
    Purpose: Production-ready code
    Protection: Protected (no direct commits)
    Deployment: Auto-deploys to production
    Merge_From: Only from feature/hotfix branches
    Merge_Requires: Code review + tests passing
  
  develop (Optional - Future):
    Purpose: Integration branch for features
    Deployment: Auto-deploys to staging
    Merge_From: Feature branches
    Status: Not currently used (direct to main for simplicity)

Temporary_Branches:
  feature/<name>:
    Purpose: New features or enhancements
    Naming: feature/admin-dashboard, feature/jwt-auth
    Branch_From: main
    Merge_To: main (via PR)
    Lifetime: Until feature complete and merged
    
  bugfix/<name>:
    Purpose: Bug fixes
    Naming: bugfix/cors-error, bugfix/login-issue
    Branch_From: main
    Merge_To: main (via PR)
    Lifetime: Until bug fixed and merged
  
  hotfix/<name>:
    Purpose: Critical production fixes
    Naming: hotfix/database-crash, hotfix/security-patch
    Branch_From: main
    Merge_To: main (immediately)
    Lifetime: Very short (hours, not days)
  
  docs/<name>:
    Purpose: Documentation-only changes
    Naming: docs/api-updates, docs/readme-fixes
    Branch_From: main
    Merge_To: main (can be fast-tracked)
  
  chore/<name>:
    Purpose: Maintenance (dependency updates, config changes)
    Naming: chore/update-dependencies, chore/eslint-config
    Branch_From: main
    Merge_To: main
```

---

## 📝 Commit Message Standards

### **Commit Message Format**

```yaml
Structure:
  <type>(<scope>): <subject>
  
  <body>
  
  <footer>

Example:
  feat(admin): add founder CRUD operations
  
  - Implement create, read, update, delete for founders
  - Add TypeScript interfaces
  - Include error handling
  
  Closes #123
```

### **Commit Types**

```yaml
feat: New feature
  Example: feat(chatbot): add Bengali response support

fix: Bug fix
  Example: fix(auth): resolve session persistence issue

docs: Documentation changes
  Example: docs(readme): update installation instructions

style: Code style changes (formatting, no logic change)
  Example: style(admin): fix indentation in AdminPanel

refactor: Code refactoring (no feature change)
  Example: refactor(database): extract connection logic

perf: Performance improvements
  Example: perf(api): add caching for founders endpoint

test: Adding or updating tests
  Example: test(auth): add login flow tests

chore: Maintenance tasks
  Example: chore(deps): update React to 19.2.7

build: Build system changes
  Example: build(vite): update config for production

ci: CI/CD changes
  Example: ci(github): add deployment workflow
```

### **Commit Message Rules**

```yaml
Subject_Line:
  - Use imperative mood ("add" not "added" or "adds")
  - Start with lowercase (after type)
  - No period at end
  - Max 72 characters
  - Be specific and descriptive

Good_Examples:
  ✅ feat(admin): add image upload for gallery
  ✅ fix(cors): include production URL in allowed origins
  ✅ docs(api): document all endpoints with examples
  ✅ refactor(database): improve query performance

Bad_Examples:
  ❌ Fixed stuff
  ❌ WIP
  ❌ Update
  ❌ changes
  ❌ feat: Added new feature for the admin panel that allows...
     (too long, should be split)

Body (Optional):
  - Wrap at 72 characters
  - Explain WHAT and WHY, not HOW
  - Use bullet points for multiple changes
  - Reference issues if applicable

Footer (Optional):
  - Reference issues: Closes #123, Fixes #456
  - Breaking changes: BREAKING CHANGE: description
  - Co-authors: Co-authored-by: Name <email>
```

---

## 🔄 Development Workflow

### **Feature Development**

```bash
# 1. Start from latest main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/founder-crud

# 3. Make changes
# ... code, code, code ...

# 4. Commit frequently (small, logical commits)
git add src/admin/AdminFounders.tsx
git commit -m "feat(admin): add founder create form"

git add backend/routes/founders.js
git commit -m "feat(api): implement founders CRUD endpoints"

git add backend/database.js
git commit -m "feat(database): add founders table schema"

# 5. Keep branch updated
git fetch origin
git rebase origin/main
# Or: git merge origin/main (if you prefer merge)

# 6. Push to remote
git push origin feature/founder-crud

# 7. Create Pull Request on GitHub
# - Add description
# - Request review
# - Wait for approval

# 8. After approval, merge to main
# - Use "Squash and merge" for clean history
# - Or "Merge commit" to preserve all commits
# - Delete feature branch after merge
```

---

### **Bug Fix Workflow**

```bash
# 1. Create bugfix branch
git checkout main
git pull origin main
git checkout -b bugfix/cors-error

# 2. Fix the bug
# ... make changes ...

# 3. Test thoroughly
npm run build
# Test locally

# 4. Commit fix
git add backend/server.js backend/.env.example
git commit -m "fix(cors): add production URL to allowed origins

- Added production domain to CORS_ORIGIN
- Updated .env.example with proper format
- Tested with production frontend

Fixes #145"

# 5. Push and create PR
git push origin bugfix/cors-error

# 6. After approval, merge
# Delete branch
```

---

### **Hotfix Workflow (Production Emergency)**

```bash
# Hotfixes are URGENT - skip some formalities for speed

# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/database-crash

# 2. Fix critical issue
# ... emergency fix ...

# 3. Minimal testing
# Test that fix works

# 4. Commit
git add backend/database.js
git commit -m "hotfix(database): prevent connection pool exhaustion

Critical fix: Release connections after query
Caused production outage for 10 minutes

Fixes #999"

# 5. Push and merge IMMEDIATELY
git push origin hotfix/database-crash

# Create PR, get quick review, merge immediately
# Don't wait for full review process

# 6. Deploy to production
# Monitor closely
```

---

## 📊 Commit Best Practices

### **Atomic Commits**

```yaml
What_Is_Atomic:
  - One commit = one logical change
  - Each commit is self-contained
  - Can be reverted independently
  - Builds/tests pass at each commit

Good_Example:
  Commit_1: feat(admin): add founder form UI
  Commit_2: feat(api): implement POST /api/founders
  Commit_3: feat(admin): connect form to API
  # Each commit works independently

Bad_Example:
  Commit_1: WIP: started working on founders
  Commit_2: More changes
  Commit_3: Fixed bugs from commit 1
  Commit_4: Actually done now
  # Should have been squashed into 1-2 logical commits
```

### **When to Commit**

```yaml
Commit_When:
  ✅ Feature component complete (one function, one component)
  ✅ Bug fixed and tested
  ✅ Refactoring of one module complete
  ✅ Documentation section complete
  ✅ Before switching context (end of day, starting new feature)

Don't_Commit_When:
  ❌ Code doesn't compile
  ❌ Tests are failing (unless explicitly WIP)
  ❌ Unrelated changes mixed together
  ❌ Temporary debug code present
  ❌ Commented-out code blocks present
```

---

## 🔀 Merging Strategies

### **Pull Request (PR) Process**

```yaml
Creating_PR:
  1. Push branch to remote
  2. Go to GitHub repository
  3. Click "New Pull Request"
  4. Select: base (main) ← compare (your branch)
  5. Add title (same as commit message format)
  6. Add description:
     - What changed
     - Why it changed
     - How to test
     - Screenshots (if UI change)
  7. Request reviewers
  8. Link related issues

PR_Description_Template:
  ## Changes
  - Added founder CRUD operations
  - Implemented TypeScript interfaces
  - Added error handling
  
  ## Why
  Admin panel needs ability to manage founders dynamically
  
  ## How to Test
  1. Login to admin panel
  2. Go to Founders section
  3. Create new founder
  4. Edit founder
  5. Delete founder
  
  ## Screenshots
  [Attach screenshots if UI change]
  
  ## Checklist
  - [x] Code builds successfully
  - [x] Tested locally
  - [x] Documentation updated
  - [x] No TypeScript errors
  
  Closes #123
```

### **Merge Options**

```yaml
Squash_and_Merge (Recommended):
  - Combines all commits into one
  - Clean, linear history
  - Easier to revert
  - Use for: Feature branches with many commits
  
  Example:
    Before:
      feat: add form
      fix: typo
      fix: another bug
      refactor: improve code
    
    After:
      feat(admin): add founder CRUD operations

Merge_Commit:
  - Preserves all commits
  - Shows full development history
  - Creates merge commit
  - Use for: Important features, major changes
  
Rebase_and_Merge:
  - Replays commits on top of main
  - Linear history, preserves commits
  - Cleanest history
  - Use for: Small, well-structured branches
```

---

## 🚫 What NOT to Commit

### **Never Commit**

```yaml
Secrets:
  ❌ .env files with real credentials
  ❌ API keys, passwords
  ❌ Database connection strings
  ❌ JWT secrets
  ✅ .env.example (without actual values)

Build_Artifacts:
  ❌ node_modules/
  ❌ dist/
  ❌ build/
  ❌ .vite/
  ❌ *.log files

IDE_Files:
  ❌ .vscode/ (unless shared team settings)
  ❌ .idea/
  ❌ *.swp, *.swo (Vim)
  ❌ .DS_Store (macOS)

Large_Files:
  ❌ Videos, large images (> 5MB)
  ❌ Database dumps
  ❌ Binary files
  ✅ Use Git LFS if needed

Temporary_Files:
  ❌ TODO.txt, NOTES.txt
  ❌ test.js, temp.js
  ❌ backup/
  ❌ old/

Debug_Code:
  ❌ console.log() statements
  ❌ debugger; statements
  ❌ Commented-out code blocks
```

---

## 🔍 Git Commands Reference

### **Daily Commands**

```bash
# Check status
git status

# Check current branch
git branch

# View commit history
git log --oneline --graph --all

# View changes
git diff
git diff --staged

# Stage files
git add <file>
git add .  # Stage all changes (use carefully)

# Commit
git commit -m "feat(scope): description"

# Push
git push origin <branch-name>

# Pull latest
git pull origin main

# Switch branch
git checkout <branch-name>
git switch <branch-name>  # Newer syntax

# Create and switch
git checkout -b <new-branch>
git switch -c <new-branch>  # Newer syntax
```

### **Advanced Commands**

```bash
# Amend last commit (before pushing)
git commit --amend -m "New message"

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) ⚠️ DANGEROUS
git reset --hard HEAD~1

# Discard changes in file
git checkout -- <file>
git restore <file>  # Newer syntax

# Unstage file
git reset HEAD <file>
git restore --staged <file>  # Newer syntax

# Stash changes
git stash
git stash pop
git stash list

# View file history
git log --follow <file>

# View who changed what
git blame <file>

# Cherry-pick commit
git cherry-pick <commit-hash>

# Rebase branch
git rebase main
git rebase -i HEAD~3  # Interactive rebase last 3 commits

# View remote branches
git branch -r

# Delete local branch
git branch -d <branch-name>
git branch -D <branch-name>  # Force delete

# Delete remote branch
git push origin --delete <branch-name>
```

---

## ⚠️ Common Git Issues

### **Merge Conflicts**

```yaml
What_Happened:
  Two branches modified the same lines

How_To_Resolve:
  1. git pull origin main
  2. Open conflicted files
  3. Look for conflict markers:
     <<<<<<< HEAD
     Your changes
     =======
     Their changes
     >>>>>>> main
  4. Manually resolve conflicts
  5. Remove conflict markers
  6. git add <resolved-file>
  7. git commit -m "merge: resolve conflicts"
  8. git push

Prevention:
  - Keep branches short-lived
  - Pull main frequently
  - Communicate with team about file changes
```

### **Accidentally Committed to Main**

```yaml
If_Not_Pushed_Yet:
  # Undo commit, keep changes
  git reset --soft HEAD~1
  
  # Create proper branch
  git checkout -b feature/my-feature
  
  # Now commit properly
  git commit -m "feat: proper commit"

If_Already_Pushed:
  ⚠️ DON'T use reset on pushed commits
  # Instead, revert the commit
  git revert <commit-hash>
  git push origin main
```

### **Need to Change Commit Message**

```yaml
Last_Commit_Not_Pushed:
  git commit --amend -m "New message"
  git push origin <branch> --force

Last_Commit_Already_Pushed:
  ⚠️ Only if no one else has pulled
  git commit --amend -m "New message"
  git push origin <branch> --force-with-lease

Older_Commit:
  # Use interactive rebase
  git rebase -i HEAD~3  # Edit last 3 commits
  # Change 'pick' to 'reword' for commits to edit
  # Save and follow prompts
```

---

## 📊 Git Workflow Checklist

### **Before Every Commit**

```yaml
- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] Tests pass (if applicable)
- [ ] No console.log() debug code
- [ ] No commented-out code blocks
- [ ] No secrets or .env files
- [ ] Commit message follows format
- [ ] Changes are logical and atomic
```

### **Before Creating PR**

```yaml
- [ ] Branch is up to date with main
- [ ] All commits have good messages
- [ ] No merge conflicts
- [ ] Local tests pass
- [ ] Build succeeds
- [ ] Documentation updated if needed
- [ ] PR description written
- [ ] Reviewers assigned
```

### **Before Merging PR**

```yaml
- [ ] Code review approved
- [ ] All comments addressed
- [ ] CI/CD checks pass (if configured)
- [ ] No conflicts with main
- [ ] Final testing completed
- [ ] Ready for deployment
```

---

## 🎯 Git Best Practices Summary

### **DO's**
```yaml
✅ Commit often (small, logical commits)
✅ Write descriptive commit messages
✅ Pull main frequently
✅ Create feature branches
✅ Delete branches after merge
✅ Review your own diff before committing
✅ Test before committing
✅ Keep commits atomic
✅ Use conventional commit format
```

### **DON'Ts**
```yaml
❌ Don't commit directly to main
❌ Don't commit broken code
❌ Don't commit secrets
❌ Don't use "WIP" or "Update" as messages
❌ Don't mix unrelated changes
❌ Don't commit commented-out code
❌ Don't force push to shared branches
❌ Don't rewrite public history
```

---

**Remember: Good Git practices save hours of debugging and make collaboration smooth. Treat your Git history as project documentation.**
