# PowerShell script to setup Java JDK 17 for Collectorsite project

# Create a directory for the JDK if it doesn't exist
$jdkDir = "C:\java-dev\jdk17"
if (!(Test-Path -Path $jdkDir)) {
    New-Item -ItemType Directory -Path $jdkDir -Force
    Write-Host "Created directory: $jdkDir"
}

# Download AdoptOpenJDK 17
$url = "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.9%2B9/OpenJDK17U-jdk_x64_windows_hotspot_17.0.9_9.zip"
$output = "$env:TEMP\openjdk17.zip"

Write-Host "Downloading OpenJDK 17..."
Invoke-WebRequest -Uri $url -OutFile $output

# Extract the JDK
Write-Host "Extracting JDK..."
Expand-Archive -Path $output -DestinationPath $jdkDir -Force

# Find the JDK directory (it's usually inside a nested folder)
$jdkPath = Get-ChildItem -Path $jdkDir -Directory | Where-Object { $_.Name -like "jdk*" } | Select-Object -First 1 -ExpandProperty FullName
if (-not $jdkPath) {
    # If we didn't find a jdk* folder, look for the bin directory
    $binDir = Get-ChildItem -Path $jdkDir -Recurse -Directory | Where-Object { $_.Name -eq "bin" } | Select-Object -First 1
    if ($binDir) {
        $jdkPath = $binDir.Parent.FullName
    } else {
        $jdkPath = $jdkDir
    }
}

# Set JAVA_HOME environment variable for the current session
$env:JAVA_HOME = $jdkPath
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $jdkPath, [System.EnvironmentVariableTarget]::User)

# Add to PATH for the current session
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

# Verify the installation
Write-Host "Java version:"
& java -version

Write-Host "JDK successfully installed at: $jdkPath"
Write-Host "JAVA_HOME has been set to: $env:JAVA_HOME"
Write-Host ""
Write-Host "NOTE: You may need to restart your terminal/IDE for the changes to take effect." 