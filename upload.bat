@echo off
set GIT_EXE="%LOCALAPPDATA%\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe"
echo [1/3] Staging changes...
%GIT_EXE% add .
echo [2/3] Committing changes...
set /p msg="Enter commit message (or press Enter for default 'Update Secure-Doc'): "
if "%msg%"=="" set msg=Update Secure-Doc
%GIT_EXE% commit -m "%msg%"
echo [3/3] Pushing to GitHub...
%GIT_EXE% push origin main
echo Done! Your changes are live on https://github.com/Dharamveer2006/Secure-Doc
pause
