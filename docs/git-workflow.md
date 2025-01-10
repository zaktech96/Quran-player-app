# Git Workflow Guide

## Basic Commands

### Staging Changes

bash
git status # Check what's changed
git add . # Stage all changes
git status # Verify what's being staged
git commit -m "..." # Commit with message

git status         # Check what's changed
git add .          # Stage all changes
git status         # Verify what's being committed
git commit -m "..."  # Commit with message
git reset         # Unstage all
git add .         # Re-add everything fresh



### Making Additional Changes
If you've made changes after `git add .`:
1. Simply run `git add .` again to include new changes
2. Or stage specific files: `git add components/`
3. Always run `git status` to verify what's being committed

### Unstaging Changes

bash
git reset # Unstage all changes
git add . # Re-add everything fresh


## Best Practices
1. Check status frequently with `git status`
2. Write clear commit messages
3. Review changes before committing
4. Stage related changes together
5. Use branches for new features

## Common Issues
- Red folders usually mean they're untracked
- Fix by running `git add folder/`
- Create `.gitkeep` in empty folders you want to track

## Tips
- Use `git diff` to see unstaged changes
- Use `git diff --staged` to see staged changes
- Break commits into logical chunks
- Keep commits focused and atomic


