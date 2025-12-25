<#
.SYNOPSIS
    Build script for AidChaos library.js
    
.DESCRIPTION
    Concatenates all module files from src/library/ into a single src/library.js file.
    Each file is a complete, self-contained class that gets combined into the final library.
    
.EXAMPLE
    .\build.ps1
    
.NOTES
    Author: Javadevil
    Run this script from the project root directory.
#>

param(
    [switch]$Verbose,
    [switch]$Watch
)

$ErrorActionPreference = "Stop"

# Define paths
$projectRoot = $PSScriptRoot
$libraryDir = Join-Path $projectRoot "src\library"
$outputFile = Join-Path $projectRoot "src\library.js"

# Define the order of files to concatenate
# Order matters: dependencies must come before dependents
$fileOrder = @(
    "AidChaosAttributes.js",      # Core: attribute definitions (no dependencies)
    "AidChaosStoryCards.js",      # Core: story card management (no dependencies)
    "AidChaosConfiguration.js",   # Depends on: StoryCards, Attributes
    "AidChaosDetection.js",       # Core: AutoCards detection (no dependencies)
    "AidChaosParser.js",          # Depends on: Attributes
    "AidChaosRoller.js",          # Depends on: Attributes
    "AidChaosHistory.js",         # Core: history reading (no dependencies)
    "AidChaosHandlers.js",        # Depends on: all above
    "AidChaosMain.js"             # Entry point: orchestrates everything
)

function Build-Library {
    Write-Host "Building library.js..." -ForegroundColor Cyan
    
    # Check if all required files exist
    $missingFiles = @()
    foreach ($file in $fileOrder) {
        $filePath = Join-Path $libraryDir $file
        if (-not (Test-Path $filePath)) {
            $missingFiles += $file
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        Write-Host "ERROR: Missing required files:" -ForegroundColor Red
        foreach ($file in $missingFiles) {
            Write-Host "  - $file" -ForegroundColor Red
        }
        exit 1
    }
    
    # Concatenate files with normalized line endings
    $content = @()
    foreach ($file in $fileOrder) {
        $filePath = Join-Path $libraryDir $file
        if ($Verbose) {
            Write-Host "  Adding: $file" -ForegroundColor Gray
        }
        
        # Read file and normalize line endings to CRLF
        $fileContent = Get-Content $filePath -Raw -Encoding UTF8
        # Normalize: replace any line ending with CRLF
        $fileContent = $fileContent -replace "(\r\n|\r|\n)", "`r`n"
        $content += $fileContent
    }
    
    # Join with double CRLF (blank line between files)
    $finalContent = $content -join "`r`n`r`n"
    
    # Write output file with UTF8 encoding (no BOM) and CRLF line endings
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($outputFile, $finalContent, $utf8NoBom)
    
    # Get file stats
    $lineCount = ($finalContent -split "`r`n").Count
    $charCount = $finalContent.Length
    $crlfCount = ([regex]::Matches($finalContent, "`r`n")).Count
    
    Write-Host "SUCCESS: library.js built successfully!" -ForegroundColor Green
    Write-Host "  Output: $outputFile" -ForegroundColor Gray
    Write-Host "  Lines: $lineCount" -ForegroundColor Gray
    Write-Host "  Size: $([math]::Round($charCount / 1024, 2)) KB" -ForegroundColor Gray
    Write-Host "  Line endings: $crlfCount CRLF (Windows)" -ForegroundColor Gray
}

function Watch-Changes {
    Write-Host "Watching for changes in $libraryDir..." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
    
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $libraryDir
    $watcher.Filter = "*.js"
    $watcher.IncludeSubdirectories = $false
    $watcher.EnableRaisingEvents = $true
    
    $action = {
        $path = $Event.SourceEventArgs.FullPath
        $name = $Event.SourceEventArgs.Name
        $changeType = $Event.SourceEventArgs.ChangeType
        
        Write-Host "`n[$changeType] $name" -ForegroundColor Yellow
        
        # Small delay to ensure file is fully written
        Start-Sleep -Milliseconds 100
        
        # Rebuild
        & Build-Library
    }
    
    Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
    Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
    Register-ObjectEvent $watcher "Deleted" -Action $action | Out-Null
    
    # Initial build
    Build-Library
    
    # Keep script running
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    }
    finally {
        $watcher.Dispose()
        Get-EventSubscriber | Unregister-Event
    }
}

# Main execution
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AidChaos Build Script v2.0" -ForegroundColor Cyan
Write-Host "  Clean Architecture Edition" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($Watch) {
    Watch-Changes
} else {
    Build-Library
}
