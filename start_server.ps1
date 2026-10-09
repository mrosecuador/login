# ==============================================================================
# MRosecuador - Produccion y Calidad
# Servidor Local Web para Computadora, Movil y Tablet (Misma red Wi-Fi)
# ==============================================================================

$port = 8085
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch "Loopback|vEthernet|Virtual" -and $_.IPAddress -notmatch "^169\." } | Select-Object -First 1).IPAddress

if (-not $ip) { $ip = "localhost" }

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " MRosecuador - Produccion y Calidad" -ForegroundColor White
Write-Host " Servidor Web Local Iniciado con Exito" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
Write-Host " Para abrir en este computador:" -ForegroundColor Yellow
Write-Host "   http://localhost:$port" -ForegroundColor Cyan
Write-Host ""
Write-Host " Para abrir en tu celular o tablet (mismo Wi-Fi):" -ForegroundColor Yellow
Write-Host "   http://${ip}:${port}" -ForegroundColor Green
Write-Host ""
Write-Host " Credenciales iniciales de prueba:" -ForegroundColor White
Write-Host "   Admin:       admin / admin" -ForegroundColor Cyan
Write-Host "   Supervisor:  supervisor / 123" -ForegroundColor Gray
Write-Host "   Calidad:     calidad / 123" -ForegroundColor Gray
Write-Host "   Operador:    operador1 / 123" -ForegroundColor Gray
Write-Host ""
Write-Host " (Presione Ctrl+C para detener el servidor)" -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Green

$appDir = $PSScriptRoot
if (-not $appDir) {
    $appDir = "C:\Users\DATA\.gemini\antigravity\scratch\mrosecuador-app"
}
Set-Location $appDir

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:$port/")
try {
    $listener.Start()
} catch {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

Start-Process "http://localhost:$port"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = "index.html" }
    
    $filePath = Join-Path $appDir $urlPath

    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".json" { "application/json; charset=utf-8" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            ".webp" { "image/webp" }
            Default { "application/octet-stream" }
        }
        
        $response.ContentType = $contentType
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $notFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.OutputStream.Write($notFoundMsg, 0, $notFoundMsg.Length)
    }
    $response.Close()
}
