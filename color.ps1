Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap('C:\Users\lapto\.gemini\antigravity\brain\1951c637-5ab3-4ee7-88c1-7651824b5414\.user_uploaded\media_1791452586523.png')
$c1 = $bmp.GetPixel(50, 50)
$c2 = $bmp.GetPixel(1, 1)
Write-Host "Quote Card bg: $($c1.R) $($c1.G) $($c1.B)"
Write-Host "Edge bg: $($c2.R) $($c2.G) $($c2.B)"
