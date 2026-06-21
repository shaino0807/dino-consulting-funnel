$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$pidFile = Join-Path $projectRoot ".data\dino-local-site-watchdog.pid"

if (-not (Test-Path -LiteralPath $pidFile)) {
    exit 0
}

$watchdogPid = Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue
if ($watchdogPid) {
    & taskkill.exe /PID $watchdogPid /T /F | Out-Null
}

Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
