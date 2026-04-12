@echo off
REM Full pipeline: sync main, one conventional commit per path (scratch-style), push main, deploy gh-pages.
REM Optional env: GIT_REMOTE (default origin), DEPLOY_BRANCH (default gh-pages), SOURCE_BRANCH (default main),
REM PUBLIC_PATH (overrides auto-detect from GitHub remote), SYNC_HARD=1 (destructive: discard local commits on SOURCE_BRANCH).
REM Extend the try_commit_group list if you add new tracked paths under src, scripts, or public.
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0.."
set "ROOT=%CD%"

if "%GIT_REMOTE%"=="" set "GIT_REMOTE=origin"
if "%DEPLOY_BRANCH%"=="" set "DEPLOY_BRANCH=gh-pages"
if "%SOURCE_BRANCH%"=="" set "SOURCE_BRANCH=main"

where git >nul 2>&1
if errorlevel 1 (
  echo ERROR: git is not on PATH.
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm is not on PATH.
  exit /b 1
)

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo ERROR: Not a git repository: %ROOT%
  exit /b 1
)

echo [1/5] Sync %SOURCE_BRANCH% from %GIT_REMOTE%
git fetch "%GIT_REMOTE%"
if errorlevel 1 exit /b 1

git show-ref --verify --quiet "refs/heads/%SOURCE_BRANCH%"
if errorlevel 1 (
  git checkout -b "%SOURCE_BRANCH%" "refs/remotes/%GIT_REMOTE%/%SOURCE_BRANCH%" 2>nul
  if errorlevel 1 (
    echo ERROR: Branch %SOURCE_BRANCH% does not exist locally or on %GIT_REMOTE%.
    exit /b 1
  )
) else (
  git checkout "%SOURCE_BRANCH%"
  if errorlevel 1 exit /b 1
)

if "%SYNC_HARD%"=="1" (
  echo SYNC_HARD=1: reset working tree to %GIT_REMOTE%/%SOURCE_BRANCH%
  git reset --hard "%GIT_REMOTE%/%SOURCE_BRANCH%"
  if errorlevel 1 exit /b 1
) else (
  git pull --ff-only "%GIT_REMOTE%" "%SOURCE_BRANCH%"
  if errorlevel 1 (
    echo ERROR: Could not fast-forward %SOURCE_BRANCH%. Resolve manually or set SYNC_HARD=1 ^(destructive^).
    exit /b 1
  )
)

if not exist "node_modules\" (
  echo Installing npm dependencies...
  call npm ci
  if errorlevel 1 exit /b 1
)

echo [2/5] Unstage for one-commit-per-path ^(Git-Commit Standard / conventional commits, scratch order^)
git reset HEAD
if errorlevel 1 exit /b 1

call :try_commit_group "docs: add documentation" README.md docs
if errorlevel 1 exit /b 1
call :try_commit_group "chore: add project configuration and dependencies" package.json package-lock.json babel.config.js vue.config.js postcss.config.js tailwind.config.js jsconfig.json
if errorlevel 1 exit /b 1

call :try_commit_group "ci: add postinstall page-flip patch" scripts\patch-page-flip.cjs
if errorlevel 1 exit /b 1
call :try_commit_group "ci: add page-flip render patch helper" scripts\patch-page-flip-render.cjs
if errorlevel 1 exit /b 1
call :try_commit_group "ci: add page-flip prev patch helper" scripts\patch-page-flip-prev.cjs
if errorlevel 1 exit /b 1
call :try_commit_group "ci: add gh-pages deploy shell script" scripts\deploy-gh-pages.sh
if errorlevel 1 exit /b 1
call :try_commit_group "ci: add gh-pages publish batch script" scripts\publish-gh-pages.bat
if errorlevel 1 exit /b 1

call :try_commit_group "feat: add public static assets" public
if errorlevel 1 exit /b 1

call :try_commit_group "feat: add vue app entry" src\main.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add root app component" src\App.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add vue router" src\router\index.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add i18n plugin setup" src\i18n\index.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add english locale copy" src\locales\en.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add traditional chinese locale copy" src\locales\zh-TW.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add useLocale composable" src\composables\useLocale.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add useClickParticles composable" src\composables\useClickParticles.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add head meta helpers" src\utils\meta.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add lenis and gsap scroll helpers" src\utils\lenisGsap.js
if errorlevel 1 exit /b 1

call :try_commit_group "feat: add site metadata" src\data\site.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add footer links data" src\data\footer.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home about copy" src\data\home\about.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home contact copy" src\data\home\contact.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home experience copy" src\data\home\experience.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home hero copy" src\data\home\hero.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home hint copy" src\data\home\hint.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home projects data" src\data\home\projects.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home sections config" src\data\home\sections.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home brand path data" src\data\home\simpleBrandPaths.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home skills data" src\data\home\skills.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home data barrel" src\data\home\index.js
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add notebook messages data" src\data\notebook\messages.js
if errorlevel 1 exit /b 1

call :try_commit_group "feat: add global styles" src\assets\main.css
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add site image assets" src\assets\images
if errorlevel 1 exit /b 1

call :try_commit_group "feat: add page site navigation" src\components\PageSiteNav.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home about section" src\components\home\HomeAbout.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home contact section" src\components\home\HomeContact.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home experience section" src\components\home\HomeExperience.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home hero section" src\components\home\HomeHero.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add home projects section" src\components\home\HomeProjects.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add marquee text animation" src\components\home\MarqueeText.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add skill marquee icon" src\components\home\SkillMarqueeIcon.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add click particles component" src\components\site\ClickParticles.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add floating language switcher" src\components\site\LanguageFloatButton.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add site footer" src\components\site\SiteFooter.vue
if errorlevel 1 exit /b 1

call :try_commit_group "feat: add home page view" src\views\Home.vue
if errorlevel 1 exit /b 1
call :try_commit_group "feat: add notebook page view" src\views\NotebookPage.vue
if errorlevel 1 exit /b 1

call :try_commit_group "chore: add cursor workspace commands" .cursor
if errorlevel 1 exit /b 1

git status --porcelain | findstr "^" >nul
if not errorlevel 1 (
  echo ERROR: Uncommitted or untracked files remain. Stage and commit manually, or add another call :try_commit_group for each new path.
  exit /b 1
)

echo [3/5] Push %SOURCE_BRANCH% to GitHub
git push -u "%GIT_REMOTE%" "%SOURCE_BRANCH%"
if errorlevel 1 exit /b 1

echo [4/5] Build with PUBLIC_PATH ^(same rules as deploy-gh-pages.sh^)
for /f "usebackq delims=" %%P in (`powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop'; $r=$env:GIT_REMOTE; if (-not $r) { $r='origin' }; ^
   if ($env:PUBLIC_PATH) { Write-Output $env:PUBLIC_PATH; exit 0 }; ^
   $url = (git remote get-url $r 2^>$null); if (-not $url) { Write-Output '/'; exit 0 }; ^
   if ($url -match 'github\.com[:/]([^/]+)/([^/.]+)(\.git)?$') { $repo = $Matches[2]; ^
     if ($repo -match '\.github\.io$') { '/' } else { '/' + $repo + '/' } } else { '/' }"`) do set "PUBLIC_PATH=%%P"
if not defined PUBLIC_PATH set "PUBLIC_PATH=/"
echo PUBLIC_PATH=!PUBLIC_PATH!

set "PUBLIC_PATH=!PUBLIC_PATH!"
call npm run build -- --public-path "!PUBLIC_PATH!"
if errorlevel 1 exit /b 1

echo [5/5] Deploy %DEPLOY_BRANCH% ^(orphan dist repo, force-push^)
pushd dist
copy /Y index.html 404.html >nul
if exist .git rmdir /s /q .git
for /f "usebackq delims=" %%U in (`git -C "%ROOT%" remote get-url "%GIT_REMOTE%"`) do set "REMOTE_URL=%%U"
for /f "usebackq delims=" %%T in (`powershell -NoProfile -Command "(Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')"`) do set "DEPLOY_TS=%%T"
git init
if errorlevel 1 (
  popd
  exit /b 1
)
git add -A
git commit -m "Deploy !DEPLOY_TS!"
if errorlevel 1 (
  popd
  exit /b 1
)
git branch -M "%DEPLOY_BRANCH%"
git remote add origin "%REMOTE_URL%"
git push -f origin "%DEPLOY_BRANCH%"
if errorlevel 1 (
  popd
  if exist dist\.git rmdir /s /q dist\.git
  exit /b 1
)
popd
if exist dist\.git rmdir /s /q dist\.git

echo Done.
exit /b 0

:try_commit_group
set "MSG=%~1"
shift
set "HAS=0"
:argloop
if "%~1"=="" goto afterargs
if exist "%~1" (
  git add -- "%~1" 2>nul
  set "HAS=1"
)
shift
goto argloop
:afterargs
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "!MSG!"
  if errorlevel 1 exit /b 1
) else if "!HAS!"=="1" (
  rem paths existed but nothing staged ^(e.g. ignored^)
) 
exit /b 0
