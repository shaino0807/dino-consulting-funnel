$ErrorActionPreference = "Stop"

function Convert-SecureStringToPlainText {
    param([Security.SecureString]$SecureValue)
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
}

Write-Host "Dino admin password setup" -ForegroundColor Cyan
Write-Host "Use at least 12 characters. The password will not be printed."
Write-Host ""

$firstSecure = Read-Host "New admin password" -AsSecureString
$secondSecure = Read-Host "Confirm admin password" -AsSecureString
$first = Convert-SecureStringToPlainText $firstSecure
$second = Convert-SecureStringToPlainText $secondSecure

try {
    if ($first.Length -lt 12) {
        throw "The admin password must contain at least 12 characters."
    }
    if ($first -cne $second) {
        throw "The passwords do not match."
    }

    $bytes = New-Object byte[] 48
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $rng.GetBytes($bytes)
    }
    finally {
        $rng.Dispose()
    }
    $sessionSecret = [Convert]::ToBase64String($bytes).TrimEnd("=").Replace("+", "-").Replace("/", "_")

    $envPath = Join-Path (Get-Location) ".env.local"
    $lines = if (Test-Path $envPath) { Get-Content -Encoding UTF8 $envPath } else { @() }
    $lines = @($lines | Where-Object {
        $_ -notmatch "^ADMIN_PASSWORD=" -and $_ -notmatch "^ADMIN_SESSION_SECRET="
    })
    $lines += "ADMIN_PASSWORD=$first"
    $lines += "ADMIN_SESSION_SECRET=$sessionSecret"
    [IO.File]::WriteAllLines($envPath, $lines, (New-Object Text.UTF8Encoding($false)))

    Write-Host ""
    Write-Host "Admin password saved securely to .env.local." -ForegroundColor Green
}
finally {
    $first = $null
    $second = $null
    $firstSecure = $null
    $secondSecure = $null
}

Read-Host "Press Enter to close"
