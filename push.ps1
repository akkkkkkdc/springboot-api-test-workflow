# ============================================================
# push.ps1 - 一键把本地仓库推到 GitHub
# ============================================================
# 用法:
#   1) 在 https://github.com/new 建一个空 repo (public, 不勾 README/license)
#   2) 把 repo URL 粘到下面 $RepoUrl
#   3) 双击运行本脚本
# ============================================================

param(
  [string]$RepoUrl = "",
  [ValidateSet("ssh","https")]
  [string]$Method = "ssh"
)

$ErrorActionPreference = "Stop"
$root = "C:\Users\wuyuan-002\Documents\项目\springboot-api-test-workflow"
Set-Location $root

if (-not $RepoUrl) {
  Write-Host ""
  Write-Host "用法: .\push.ps1 -RepoUrl git@github.com:yourname/yourname-repo.git" -ForegroundColor Yellow
  Write-Host "  或: .\push.ps1 -RepoUrl https://github.com/yourname/yourname-repo.git -Method https" -ForegroundColor Yellow
  Write-Host ""
  exit 1
}

# 1. 配 remote
$existing = git remote get-url origin 2>$null
if ($existing) {
  Write-Host "[1/3] remote origin 已存在: $existing" -ForegroundColor Cyan
  $ans = Read-Host "    覆盖? (y/N)"
  if ($ans -eq "y") {
    git remote set-url origin $RepoUrl
    Write-Host "    -> 已更新为 $RepoUrl" -ForegroundColor Green
  }
} else {
  git remote add origin $RepoUrl
  Write-Host "[1/3] remote origin 已添加: $RepoUrl" -ForegroundColor Green
}

# 2. 验证 SSH key (Method = ssh)
if ($Method -eq "ssh") {
  $sshKey = "$env:USERPROFILE\.ssh\id_ed25519"
  if (-not (Test-Path $sshKey)) {
    Write-Host "[2/3] ⚠️ 找不到 $sshKey" -ForegroundColor Red
    Write-Host "    切到 https 模式: .\push.ps1 -RepoUrl ... -Method https" -ForegroundColor Yellow
    exit 1
  } else {
    Write-Host "[2/3] SSH key 已就绪" -ForegroundColor Green
  }
} else {
  Write-Host "[2/3] HTTPS 模式" -ForegroundColor Cyan
}

# 3. push
Write-Host "[3/3] 推送 main -> origin ..." -ForegroundColor Cyan
git push -u origin main --force-with-lease 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "✅ 推送成功!" -ForegroundColor Green
  Write-Host "   访问: $RepoUrl" -ForegroundColor Cyan
} else {
  Write-Host ""
  Write-Host "❌ 推送失败, 检查上面错误" -ForegroundColor Red
}
