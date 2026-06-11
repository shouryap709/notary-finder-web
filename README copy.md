# Notary Overnight Batch

## What this is

A drop-in folder that runs 10 Claude Code prompts unattended.
Auto-commits each one, pushes a fresh branch at the end.
Runs while you're away from the keyboard (overnight or during the day).

## One-time setup

1. Drag this entire `notary-overnight/` folder into your project folder
   at `~/Desktop/notary-finder-web/`. The end result should look like:

   ```
   ~/Desktop/notary-finder-web/
     ├── notary-marketplace.html
     ├── overnight.sh         <-- moved from here
     └── prompts/             <-- moved from here
         ├── 01-polish-pass.txt
         ├── 02-mobile-responsive.txt
         └── ... etc
   ```

   You can either drag the contents OUT of `notary-overnight/` into the
   project folder, or move the whole folder in and reference paths
   accordingly.

2. Open VS Code's terminal in your project folder (Ctrl + ~).

3. Make the script executable:

   ```
   chmod +x overnight.sh
   ```

## Run it

When you walk away from your computer:

```
caffeinate -i ./overnight.sh
```

`caffeinate -i` keeps your Mac awake while the script runs.
When the script finishes, normal sleep resumes.

Leave VS Code open. Don't quit it — that kills the terminal.
Plug your Mac into power.

## What happens

For each prompt file (in numeric order):
1. Claude Code reads the prompt
2. Claude Code edits notary-marketplace.html accordingly
3. Script auto-commits the change as "Overnight: 01-polish-pass" etc.
4. Moves to the next prompt

At the end:
- All commits are pushed to a fresh branch named
  `overnight-batch-YYYYMMDD-HHMM`
- Nothing touches `main` — it's safe to review before merging

## When you come back

1. Open `overnight.log` in your project folder. See what happened.
2. Open GitHub. You'll see a new branch. Click it.
3. Click "Compare & pull request" to review the full diff.
4. If everything looks good, merge to main. If something broke, you
   can `git revert` individual commits.

## Editing prompts

Each `prompts/*.txt` file is independent. Edit, add, or remove any of
them. The script runs everything in `prompts/*.txt` sorted by filename.

To add a new prompt, just drop a new `.txt` file in `prompts/`. Use
a numeric prefix to control order: `11-newthing.txt`, `12-otherthing.txt`.

## Cost / token usage warning

Each prompt runs as a fresh Claude Code session. That means each one
re-reads notary-marketplace.html from scratch (~2k tokens just for the
read). Across 10 prompts, expect significant token usage.

If you're on a free or limited plan, run 3-5 prompts at a time instead
of all 10. Edit the `prompts/` folder accordingly.

## Pre-flight check

Before running unattended, do a single-prompt dry run while watching:

```
cat prompts/01-polish-pass.txt | claude --dangerously-skip-permissions -p
```

If that completes cleanly in ~5 minutes, the whole batch will work.
If something weird happens, you'll catch it before sleeping through it.
