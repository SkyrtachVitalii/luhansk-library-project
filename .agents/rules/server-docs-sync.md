---
trigger: model_decision
description: Mandatory rule. Syncs server-side documentation in the server/ folder whenever API routes, models, services, or types are modified, created, or deleted
globs: server/**/*
---

# Rule: Sync Server Documentation

## Context
This project contains a backend application in the `server` directory. Each subfolder in `server/src/` (and the root `server/` folder) contains a `.md` file (e.g., `README.md` or `DOCS.md`) that describes its technical implementation.

## Trigger
Whenever you (the AI Agent) modify, create, move, or delete any `.ts`, `.js`, or configuration file within the `server/` directory.

## Actions (MANDATORY)
1. Identify the folder where the code changes occurred.
2. Locate the documentation file (e.g., `README.md`) in that specific folder **OR its immediate parent folder** (especially if files were moved or deleted). If it does not exist, create it.
3. **CRITICAL STEP:** Before finishing your response, you MUST update the documentation file to reflect the new state of the codebase.
4. Update rules:
   - If a route/field/type was added, document it.
   - If a file was DELETED or RENAMED, you MUST remove or update its mention in the `README.md`.
   - Keep updates concise; only apply relevant diffs.
5. Do not touch documentation outside of the `server` folder.