# PowerShell 초경량 로컬 웹 서버
$ports = @(8090, 8888, 3000, 5000, 8081)
$listener = $null
$selectedPort = 0

foreach ($p in $ports) {
    try {
        $tempListener = New-Object System.Net.HttpListener
        $tempListener.Prefixes.Add("http://localhost:$p/")
        $tempListener.Start()
        $listener = $tempListener
        $selectedPort = $p
        break
    } catch {
        # 다음 포트 시도
    }
}

if (-not $listener) {
    Write-Host "사용 가능한 포트를 찾을 수 없습니다." -ForegroundColor Red
    exit
}

$path = $PSScriptRoot

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  🌱 다정다감(多情多感) 웹서버가 실행되었습니다!" -ForegroundColor Green
Write-Host "  접속 주소: http://localhost:$selectedPort/" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

Start-Process "http://localhost:$selectedPort/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) {
            $urlPath = "index.html"
        }

        $filePath = Join-Path $path $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($extension)) {
                $contentType = $mimeTypes[$extension]
            }

            $response.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($err, 0, $err.Length)
        }
        $response.Close()
    } catch {
    }
}
