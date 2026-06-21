$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$dataRoot = Join-Path $projectRoot ".data"
$logRoot = Join-Path $projectRoot ".logs"
$pidFile = Join-Path $dataRoot "dino-local-site-watchdog.pid"
$logFile = Join-Path $logRoot "dino-local-site.log"
$nodePath = "C:\Program Files\nodejs\node.exe"
$npmPath = "C:\Program Files\nodejs\npm.cmd"
$nextPath = Join-Path $projectRoot "node_modules\next\dist\bin\next"

New-Item -ItemType Directory -Path $dataRoot -Force | Out-Null
New-Item -ItemType Directory -Path $logRoot -Force | Out-Null

if (Test-Path -LiteralPath $pidFile) {
    $existingPid = Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue
    if ($existingPid -and (Get-Process -Id $existingPid -ErrorAction SilentlyContinue)) {
        exit 0
    }
}

Set-Content -LiteralPath $pidFile -Value $PID -Encoding ASCII

try {
    Set-Location -LiteralPath $projectRoot

    "[$(Get-Date -Format o)] Building production site." | Add-Content -LiteralPath $logFile
    & $npmPath run build *>> $logFile
    if ($LASTEXITCODE -ne 0) {
        throw "Production build failed."
    }

    while ($true) {
        "[$(Get-Date -Format o)] Starting site on 127.0.0.1:3000." | Add-Content -LiteralPath $logFile
        & $nodePath $nextPath start --hostname 127.0.0.1 --port 3000 *>> $logFile
        "[$(Get-Date -Format o)] Site process exited with code $LASTEXITCODE. Restarting in 5 seconds." | Add-Content -LiteralPath $logFile
        Start-Sleep -Seconds 5
    }
}
finally {
    Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
}
