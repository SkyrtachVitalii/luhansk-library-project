---
trigger: model_decision
description: Mandatory rule. Syncs client-side documentation in the client/ folder whenever code, components, routes, or types are modified, created, or deleted
globs: client/**/*
---

# Rule: Sync Client Documentation

## Context
This project contains a frontend Next.js application in the `client` directory. Each subfolder in `client/src/` (and the root `client/` folder) contains a `.md` file (e.g., `README.md`) that describes its routing, components, state management (Redux), and types.

## Trigger
Whenever you (the AI Agent) modify, create, move, or delete any `.ts`, `.tsx`, `.js`, `.jsx`, `.scss`, or configuration file within the `client/` directory.

## Actions (MANDATORY)
1. Identify the folder where the code changes occurred.
2. Locate the documentation file (e.g., `README.md`) in that specific folder **OR its immediate parent folder** (especially if files were moved or deleted). If it does not exist, create it.
3. **CRITICAL STEP:** Before finishing your response, you MUST update the documentation file to reflect the new state of the codebase.
4. Update rules:
   - If a new Next.js route (page/layout) was added in `app/`, document it.
   - If a new Redux slice or API call was added in `lib/` or `utils/`, describe its purpose.
   - If a new component was added, list it.
   - If a file was DELETED or RENAMED, you MUST remove or update its mention in the `README.md`.
   - Keep updates concise; only apply relevant diffs.
5. Do not touch documentation outside of the `client` folder.