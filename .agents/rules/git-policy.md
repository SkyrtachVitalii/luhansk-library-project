---
trigger: model_decision
description: Use this rule whenever handling Git operations, executing git commands, or suggesting commit messages. Enforces git commit/push restrictions and commit message format
---

# Git Rules & Commit Policy

## 1. Strict Restrictions (Commit & Push Prohibition)
- **STRICTLY FORBIDDEN:** You are PROHIBITED from executing any commands that modify Git history or send code to remote repositories (including but not limited to: `git commit`, `git push`, `git rebase`, `git merge`, `git cherry-pick`).
- **ONLY THE HUMAN USER** has permission to execute commits and pushes.
- **YOUR ROLE:** You are only allowed to inspect the Git status (`git status`, `git diff`) and provide recommendations to the user regarding commits and pushes.

## 2. Commit Message Format Requirements
Whenever you recommend or suggest a commit message to the user, you MUST follow this strict format:
- The commit message must be **a single line**.
- Format: `<type>/<task_id> <description>`
- **Structure breakdown:**
  - `<type>`: Feature or change type (e.g., `feature`, `fix`, `refactor`, `chore`, `docs`).
  - `/`: Slash separator right after the type.
  - `<task_id>`: Task or ticket ID (e.g., `4566`).
  - `<description>`: Short, clear description of the changes in lowercase.
- **Example:** `feature/4566 add button component`
