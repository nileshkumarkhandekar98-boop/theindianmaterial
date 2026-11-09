# Run this after you add or remove pictures and videos.
# Right-click this file > "Run with PowerShell", or in a terminal:  powershell -ExecutionPolicy Bypass -File update-media.ps1
#
#  media\photos  -> gallery photos (.jpg .jpeg .png .webp). The file name becomes the caption:
#                   "Siddhant Dhariwal - portrait.jpg" shows as "Siddhant Dhariwal - portrait".
#  media\videos  -> gallery videos (.mp4 .webm). Keep each under about 20 MB for fast loading.
#  media\guests  -> one square photo per guest, named after the guest, e.g. "romit-savla.jpg".
#
# It rewrites media.js, which the site reads. Then upload the whole site folder again.

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
function Esc($s) { return $s.Replace('\', '\\').Replace('"', '\"') }
function List($dir, $exts) {
    $p = Join-Path $here $dir
    if (-not (Test-Path $p)) { return @() }
    return Get-ChildItem -LiteralPath $p -File | Where-Object { $exts -contains $_.Extension.ToLower() } | Sort-Object Name
}
$photos = List "media\photos" @(".jpg", ".jpeg", ".png", ".webp")
$videos = List "media\videos" @(".mp4", ".webm")
$guests = List "media\guests" @(".jpg", ".jpeg", ".png", ".webp")

$lines = @("// Written by update-media.ps1 on $(Get-Date -Format 'yyyy-MM-dd HH:mm'). Do not edit by hand.", "window.MEDIA = {")
$lines += "  photos: ["
$lines += ($photos | ForEach-Object { '    {"src": "media/photos/' + (Esc $_.Name) + '", "caption": "' + (Esc $_.BaseName) + '"}' }) -join ",`n"
$lines += "  ],"
$lines += "  videos: ["
$lines += ($videos | ForEach-Object { '    {"src": "media/videos/' + (Esc $_.Name) + '", "caption": "' + (Esc $_.BaseName) + '"}' }) -join ",`n"
$lines += "  ],"
$lines += "  guests: {"
$lines += ($guests | ForEach-Object { '    "' + (Esc $_.BaseName.ToLower()) + '": "media/guests/' + (Esc $_.Name) + '"' }) -join ",`n"
$lines += "  }"
$lines += "};"
[IO.File]::WriteAllText((Join-Path $here "media.js"), ($lines -join "`n"), (New-Object Text.UTF8Encoding $false))
Write-Host "media.js updated: $($photos.Count) photos, $($videos.Count) videos, $($guests.Count) guest portraits."
