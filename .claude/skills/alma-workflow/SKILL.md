---
name: alma-workflow
description: How to deliver changes on the Alma Studio (آتلیه آلما) project — always open a pull request for the owner to approve in GitHub; never push directly to main.
---

# Alma Studio — delivery workflow (always)

The owner (Reza) approves every change himself on GitHub. He does not want to run git or deploy commands.

1. Work on a new branch (`feat/<short-name>` or `fix/<short-name>`), never on `main`.
2. Run `npx tsc --noEmit`, `npx eslint src`, `npm test`, `npm run build` before committing.
3. Never commit `data/content.json` changes made for tests (`git checkout data/content.json`).
4. Commit, push the branch, and open a **pull request into `main`** (`gh pr create --base main`). Never push to `main` directly.
5. Write the PR title and body in Persian, short: what changed, how it was checked. Dates in the text are Jalali.
6. Finish by telling the owner the PR is ready for him to approve and merge. Do not explain more unless he asks.
7. After he merges, the CI/CD workflow runs; the deploy job waits for his approval in the GitHub `production` environment. Only if that is not set up yet, give him the manual deploy command:
   `cd /home/cluadai/alma-studio && git pull origin main && docker compose build && docker compose up -d`

Project rules that always apply: every date is Jalali and Persian; the brand logo is a red apple; follow the Emil Kowalski design rules in `.claude/skills/emil-design-eng`; no sound effects.
