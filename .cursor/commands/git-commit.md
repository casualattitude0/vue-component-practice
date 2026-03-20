# git-commit

Commit staged or unstaged changes following Git Flow conventions using MCP git tools.
\*Also follow "GIT Flow Standard".

## Usage

Use `/commit-changes` in chat to commit your changes. The command will:

1. Check git status for changes
2. Analyze changes to determine independent logical groups (features, fixes, refactors)
3. Selectively stage files for a cohesive commit (avoiding "catch-all" commits)
4. Create a properly formatted commit message
5. Commit the specific changes

## MCP Tools

Use the `user-git` MCP server for all git operations:

| Operation             | MCP Tool            | Parameters                              |
| --------------------- | ------------------- | --------------------------------------- |
| Check status          | `git_status`        | `repo_path`                             |
| View unstaged changes | `git_diff_unstaged` | `repo_path`, `context_lines` (optional) |
| View staged changes   | `git_diff_staged`   | `repo_path`, `context_lines` (optional) |
| Stage files           | `git_add`           | `repo_path`, `files` (array)            |
| Create commit         | `git_commit`        | `repo_path`, `message`                  |
| View commit history   | `git_log`           | `repo_path`, `max_count` (optional)     |

## Commit Types

Follow conventional commit message format with these types:

- **`feat:`** - New feature implementation
- **`fix:`** - Bug fix
- **`ci:`** - Continuous Integration changes
- **`style:`** - Code style changes (formatting, indentation) that don't affect logic
- **`refactor:`** - Code refactoring that neither adds features nor fixes bugs
- **`docs:`** - Documentation changes

## Examples

Single-change commits:
- `feat: add user authentication`
- `fix: resolve login page layout issue on mobile`

Multi-change commits (with bullet points):
```
feat: update Level 7 timeline and scene configuration

- Add Level 7 timeline prefabs
- Update Desktop_Game_Level7 timeline sequences
- Adjust Level 7 scene and configuration
- Update font atlas and GameScene prefab
```

```
fix: resolve minion spawning issues

- Fix null reference in MinionSpawner
- Update NavMeshMovementBehavior initialization
- Add validation for network spawn timing
```

## Workflow

When you run this command, I will:

1. **Gather context** (parallel MCP calls):
   - `git_status` - Get current working tree status
   - `git_diff_unstaged` - Analyze unstaged changes
   - `git_diff_staged` - Analyze already staged changes
   - `git_log` (max_count: 5) - Review recent commit style

2. **Filter and group files**:
   - **Exclude irrelevant files**:
     - ❌ `mono_crash.*` files (Unity crash dumps)
     - ❌ `*.log` files (log files)
     - ❌ `*.tmp` files (temporary files)
     - ❌ Build artifacts, cache files
     - ❌ IDE-specific files not tracked by git
   - Separate UI changes from backend logic
   - Group related feature files together
   - Identify distinct bug fixes, refactors, or features

3. **For each logical group**:
   - Determine the commit type:
     - **`feat:`** - New files, new functionality, feature additions
     - **`fix:`** - Bug fixes, error corrections, issue resolutions
     - **`ci:`** - CI/CD config changes, workflow files, build scripts
     - **`style:`** - Formatting, whitespace, indentation (no logic changes)
     - **`refactor:`** - Code restructuring, optimization, cleanup
     - **`docs:`** - Documentation files, README updates, comments
   - Stage files using `git_add` with the relevant file paths
   - Draft a descriptive commit message following repository conventions:
     ```
     {type}: {subject}
     
     - {change 1}
     - {change 2}
     - {change 3}
     ```
     - Subject: imperative, present tense, lowercase, no period, under 50 chars
     - Body: bullet points with "-" prefix, one per logical change
     - Each bullet: capitalize first letter, imperative tense, no period
   - Commit using `git_commit` with formatted message

4. **Execute commits automatically**:
   - **DO NOT ask for confirmation** - proceed with commits immediately
   - Create all commits in sequence without waiting for user approval
   - Only stop if there are errors or conflicts

## Behavior Rules

**CRITICAL: This command MUST execute commits, not just propose them.**

- ✅ **Automatically stage and commit** all logical groups
- ✅ **Execute multiple commits** in sequence without asking
- ✅ **Report results** after commits are completed
- ❌ **DO NOT** present proposed commits and wait for approval
- ❌ **DO NOT** ask "Would you like me to proceed?"
- ❌ **DO NOT** stop before executing commits

**Exception:** Only ask for clarification if:

- Commit grouping is genuinely ambiguous (rare)
- Critical files might be accidentally included (credentials, secrets)
- Destructive operations detected (force push, hard reset)

## File Exclusion Rules

**CRITICAL: Never stage or commit these file types:**

- ❌ `mono_crash.*` - Unity crash dump files
- ❌ `*.log` - Log files
- ❌ `*.tmp`, `*.temp` - Temporary files
- ❌ Build artifacts (bin/, obj/, Build/, Builds/)
- ❌ Cache files (Library/, Temp/, .vs/)
- ❌ OS-specific files (.DS_Store, Thumbs.db)
- ❌ Credentials, secrets, API keys

**Always check file relevance before staging:**
- Only commit source code, assets, and configuration files
- Verify files are part of the project's tracked files
- Skip files that are typically gitignored
