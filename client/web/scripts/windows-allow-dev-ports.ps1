#Requires -RunAsAdministrator
<#
  Mở cổng TCP cho Next (3000) và API Nest (8000) trên Windows Firewall — chạy một lần khi điện thoại không vào được http://IP-LAN:3000.
  Chuột phải PowerShell -> Run as Administrator, rồi:
    cd ...\client\web
    .\scripts\windows-allow-dev-ports.ps1
#>
$ErrorActionPreference = "Stop"
$ports = @(3000, 8000)
foreach ($port in $ports) {
    $name = "Food-Platform dev TCP $port"
    $existing = Get-NetFirewallRule -DisplayName $name -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "Da co rule: $name"
        continue
    }
    New-NetFirewallRule `
        -DisplayName $name `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort $port `
        -Profile Private, Domain, Public `
        | Out-Null
    Write-Host "Da tao rule: $name (TCP $port)"
}
Write-Host "`nXong. Chay lai: npm run dev:mobile"
