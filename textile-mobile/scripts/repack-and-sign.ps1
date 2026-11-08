Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

$ErrorActionPreference = "Stop"

$workspace = "C:\mobile system manager\textile-mobile"
$srcApk = "$workspace\noxis-mobile-release.apk"
$stagingApk = "$workspace\temp-staging.apk"
$alignedApk = "$workspace\temp-aligned.apk"
$finalApk = "$workspace\noxis-preview.apk"
$hbcFile = "$workspace\assets\index.android.bundle"

Write-Host "Found fresh Hermes bundle: $hbcFile"

# 1. Copy source apk to staging
Copy-Item $srcApk $stagingApk -Force
Write-Host "Copied $srcApk to $stagingApk"

# 2. Open archive and replace bundle & native splash drawables & strip stale signatures
$zip = [System.IO.Compression.ZipFile]::Open($stagingApk, [System.IO.Compression.ZipArchiveMode]::Update)

# Replace Hermes bundle
$oldBundle = $zip.GetEntry("assets/index.android.bundle")
if ($oldBundle) {
    $oldBundle.Delete()
    Write-Host "Removed old assets/index.android.bundle"
}

$newEntry = $zip.CreateEntry("assets/index.android.bundle", [System.IO.Compression.CompressionLevel]::Optimal)
$entryStream = $newEntry.Open()
$fileStream = [System.IO.File]::OpenRead($hbcFile)
$fileStream.CopyTo($entryStream)
$fileStream.Close()
$entryStream.Close()
Write-Host "Injected new Hermes bundle into assets/index.android.bundle"

# Replace native splashscreen placeholders with official Omnora Labs parent company logos
$splashMap = @{
    "res/gV.png" = "$workspace\android\app\src\main\res\drawable-mdpi\splashscreen_logo.png"
    "res/Zt.png" = "$workspace\android\app\src\main\res\drawable-hdpi\splashscreen_logo.png"
    "res/42.png" = "$workspace\android\app\src\main\res\drawable-xhdpi\splashscreen_logo.png"
    "res/St.png" = "$workspace\android\app\src\main\res\drawable-xxhdpi\splashscreen_logo.png"
    "res/S7.png" = "$workspace\android\app\src\main\res\drawable-xxxhdpi\splashscreen_logo.png"
    "res/76.png" = "$workspace\assets\omnoralabs.png"
}

foreach ($entryName in $splashMap.Keys) {
    $srcLogoPath = $splashMap[$entryName]
    if (Test-Path $srcLogoPath) {
        $existingEntry = $zip.GetEntry($entryName)
        if ($existingEntry) {
            $existingEntry.Delete()
        }
        $newLogoEntry = $zip.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
        $logoStream = $newLogoEntry.Open()
        $logoFileStream = [System.IO.File]::OpenRead($srcLogoPath)
        $logoFileStream.CopyTo($logoStream)
        $logoFileStream.Close()
        $logoStream.Close()
        Write-Host "Replaced native splash placeholder $entryName with Omnora Labs logo from $srcLogoPath"
    }
}

# Also ensure assets/noxis.png and assets/splash.png are present in assets/
$extraAssets = @{
    "assets/assets/noxis.png" = "$workspace\assets\noxis.png"
    "assets/assets/noxis_hub_logo.png" = "$workspace\assets\noxis_hub_logo.png"
    "assets/assets/splash.png" = "$workspace\assets\splash.png"
    "assets/assets/omnoralabs.png" = "$workspace\assets\omnoralabs.png"
}

foreach ($eName in $extraAssets.Keys) {
    $eSrc = $extraAssets[$eName]
    if (Test-Path $eSrc) {
        $existing = $zip.GetEntry($eName)
        if ($existing) { $existing.Delete() }
        $entry = $zip.CreateEntry($eName, [System.IO.Compression.CompressionLevel]::Optimal)
        $s1 = $entry.Open()
        $s2 = [System.IO.File]::OpenRead($eSrc)
        $s2.CopyTo($s1)
        $s2.Close()
        $s1.Close()
        Write-Host "Injected $eName into APK"
    }
}

# Add fresh assets from dist/assets if exists
$distAssets = "$workspace\dist\assets"
if (Test-Path $distAssets) {
    Get-ChildItem $distAssets | ForEach-Object {
        $assetEntryName = "assets/assets/" + $_.Name
        $existing = $zip.GetEntry($assetEntryName)
        if ($existing) { $existing.Delete() }
        $assetEntry = $zip.CreateEntry($assetEntryName, [System.IO.Compression.CompressionLevel]::Optimal)
        $aStream = $assetEntry.Open()
        $fStream = [System.IO.File]::OpenRead($_.FullName)
        $fStream.CopyTo($aStream)
        $fStream.Close()
        $aStream.Close()
    }
    Write-Host "Injected dist assets into APK assets/assets/"
}

# Strip old signatures so apksigner signs cleanly
$entriesToDelete = @()
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -match "^META-INF/.*(\.SF|\.RSA|\.DSA|MANIFEST\.MF)$") {
        $entriesToDelete += $entry
    }
}

foreach ($e in $entriesToDelete) {
    $e.Delete()
}
Write-Host "Cleaned $($entriesToDelete.Count) stale signature files from META-INF"

$zip.Dispose()
Write-Host "Closed staging zip archive."

# 3. Zipalign
$zipalignExe = "E:\Unity editor\6000.2.12f1\Editor\Data\PlaybackEngines\AndroidPlayer\SDK\build-tools\36.0.0\zipalign.exe"
if (Test-Path $alignedApk) { Remove-Item $alignedApk -Force }

Write-Host "Running zipalign..."
& $zipalignExe -p -f 4 $stagingApk $alignedApk
if ($LASTEXITCODE -ne 0) { throw "zipalign failed with exit code $LASTEXITCODE" }
Write-Host "Zipalign succeeded."

# 4. Sign using uber-apk-signer with official commercial release keystore
$signerJar = "$workspace\uber-apk-signer.jar"
$ksPath = "$workspace\android\app\noxis-release-key.jks"
$javaExe = "$env:JAVA_HOME\bin\java.exe"
if (-not (Test-Path $javaExe)) {
    $javaExe = "E:\latest Android studio\jbr\bin\java.exe"
}
Write-Host "Signing with uber-apk-signer using official commercial release keystore..."
& $javaExe -jar $signerJar -a $alignedApk --ks $ksPath --ksAlias "noxis-key-alias" --ksPass "noxis123" --ksKeyPass "noxis123" --allowResign --overwrite --verbose
if ($LASTEXITCODE -ne 0) { throw "uber-apk-signer failed with exit code $LASTEXITCODE" }

# 5. Verify signatures
$apksignerJar = "E:\Unity editor\6000.2.12f1\Editor\Data\PlaybackEngines\AndroidPlayer\SDK\build-tools\36.0.0\lib\apksigner.jar"
Write-Host "Verifying signatures with Android SDK apksigner..."
& $javaExe -jar $apksignerJar verify -v --print-certs $alignedApk

# 6. Copy to final output locations
Copy-Item $alignedApk $finalApk -Force
Copy-Item $alignedApk "$workspace\noxis-mobile-release.apk" -Force

$destDirs = @(
    "c:\Users\omnora\OneDrive\Desktop\new_system\omnora-prime-v13\out\downloads",
    "c:\Users\omnora\OneDrive\Desktop\new_system\omnora-prime-v13\out",
    "c:\Users\omnora\OneDrive\Desktop\new_system\omnora-prime-v13\public\downloads",
    "c:\Users\omnora\OneDrive\Desktop\new_system\omnora-prime-v13\public"
)

foreach ($dir in $destDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    Copy-Item $alignedApk "$dir\noxis-preview.apk" -Force
    Copy-Item $alignedApk "$dir\noxis-hub-latest.apk" -Force
    Write-Host "Copied updated APK to $dir"
}

Remove-Item $stagingApk -Force -ErrorAction SilentlyContinue
Remove-Item $alignedApk -Force -ErrorAction SilentlyContinue

# 7. Compute SHA-256 and auto-update version.json
$fileHash = (Get-FileHash -Path $finalApk -Algorithm SHA256).Hash.ToLower()
$fileSize = (Get-Item $finalApk).Length
$versionJsonPath = "$workspace\version.json"
if (Test-Path $versionJsonPath) {
    $vData = Get-Content $versionJsonPath -Raw | ConvertFrom-Json
    $vData.hash = $fileHash
    $vData.file_size = $fileSize
    $vData.latest_version = "15.0.2"
    $vData.versionCode = 8
    $vData.released_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    $vData | ConvertTo-Json -Depth 5 | Set-Content $versionJsonPath -Encoding UTF8
    Write-Host "Updated version.json with SHA256: $fileHash ($fileSize bytes)"
}

Write-Host "=========================================================="
Write-Host "SUCCESS! Generated production APK at:"
Write-Host "  $finalApk"
Write-Host "=========================================================="
