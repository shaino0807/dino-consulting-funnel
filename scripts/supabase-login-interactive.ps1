$ErrorActionPreference = "Stop"

Write-Host "Supabase CLI secure login" -ForegroundColor Cyan
Write-Host "1. In the browser, create a personal access token."
Write-Host "2. Paste it below. The token will not be printed."
Write-Host ""

$secureToken = Read-Host "Supabase access token" -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)

try {
    $token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    & npx.cmd --yes supabase login --token $token
    if ($LASTEXITCODE -ne 0) {
        throw "Supabase login failed."
    }
    Write-Host ""
    Write-Host "Supabase login completed. You can close this window." -ForegroundColor Green
}
finally {
    if ($pointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
    $token = $null
    $secureToken = $null
}

Read-Host "Press Enter to close"
