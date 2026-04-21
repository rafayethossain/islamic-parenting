# update-version.ps1
# Script to increment version and update cache name

$versionFile = "version.json"
$swFile = "sw.js"

if (Test-Path $versionFile) {
    $json = Get-Content $versionFile | ConvertFrom-Json
    $versionParts = $json.version.Split('.')
    $patch = [int]$versionParts[2] + 1
    $newVersion = "$($versionParts[0]).$($versionParts[1]).$patch"
    
    $json.version = $newVersion
    $json.last_updated = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    
    # Increment cache name if it ends in a number
    if ($json.cache_name -match "v(\d+)$") {
        $vNum = [int]$matches[1] + 1
        $json.cache_name = $json.cache_name -replace "v\d+$", "v$vNum"
    }

    $json | ConvertTo-Json | Set-Content $versionFile
    Write-Host "Updated version.json to $newVersion and cache_name to $($json.cache_name)"

    # Update sw.js CACHE_NAME
    if (Test-Path $swFile) {
        $swContent = Get-Content $swFile
        $newCacheLine = "const CACHE_NAME = '$($json.cache_name)';"
        $swContent = $swContent -replace "const CACHE_NAME = '.*?';", $newCacheLine
        $swContent | Set-Content $swFile
        Write-Host "Updated $swFile CACHE_NAME to $($json.cache_name)"
    }
} else {
    Write-Error "version.json not found."
}
