# PowerShell script to set up Prisma second database configuration
# Run this script from the project root: .\create-prisma2-setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "Creating Prisma second database setup..." -ForegroundColor Green

# 1. Create prisma/schema2.prisma
Write-Host "Creating prisma/schema2.prisma..." -ForegroundColor Yellow
$schema2Content = @"
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client2"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL2")
}

// Example models for second database
// You can modify these or add your own models

model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique @db.VarChar(255)
  email     String    @unique @db.VarChar(255)
  fullName  String?   @db.VarChar(255)
  phone     String?   @db.VarChar(50)
  status    String?   @default("active") @db.VarChar(20)
  createdAt DateTime? @default(now()) @db.DateTime(0)
  updatedAt DateTime? @updatedAt @db.DateTime(0)
  createdBy String?   @db.VarChar(250)
  updatedBy String?   @db.VarChar(250)
  
  posts     Post[]
  comments  Comment[]
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String    @db.VarChar(500)
  content   String?   @db.Text
  status    String?   @default("draft") @db.VarChar(20)
  userId    Int
  createdAt DateTime? @default(now()) @db.DateTime(0)
  updatedAt DateTime? @updatedAt @db.DateTime(0)
  createdBy String?   @db.VarChar(250)
  updatedBy String?   @db.VarChar(250)
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Restrict, onUpdate: Restrict)
  comments  Comment[]
  
  @@index([userId])
  @@index([status])
}

model Comment {
  id        Int       @id @default(autoincrement())
  content   String    @db.Text
  postId    Int
  userId    Int
  status    String?   @default("active") @db.VarChar(20)
  createdAt DateTime? @default(now()) @db.DateTime(0)
  updatedAt DateTime? @updatedAt @db.DateTime(0)
  createdBy String?   @db.VarChar(250)
  updatedBy String?   @db.VarChar(250)
  
  post      Post      @relation(fields: [postId], references: [id], onDelete: Restrict, onUpdate: Restrict)
  user      User      @relation(fields: [userId], references: [id], onDelete: Restrict, onUpdate: Restrict)
  
  @@index([postId])
  @@index([userId])
}
"@

$schema2Path = "prisma\schema2.prisma"
if (Test-Path $schema2Path) {
    Write-Host "File $schema2Path already exists. Skipping..." -ForegroundColor Yellow
} else {
    Set-Content -Path $schema2Path -Value $schema2Content -Encoding UTF8
    Write-Host "✓ Created $schema2Path" -ForegroundColor Green
}

# 2. Create server/utils/prisma2.ts
Write-Host "Creating server/utils/prisma2.ts..." -ForegroundColor Yellow
$prisma2Content = @"
import { PrismaClient as PrismaClient2 } from "@prisma/client2";

const prisma2ClientSingleton = () => {
  return new PrismaClient2();
};

declare global {
  var prisma2: undefined | ReturnType<typeof prisma2ClientSingleton>;
}

const prisma2 = globalThis.prisma2 ?? prisma2ClientSingleton();

export default prisma2;

if (process.env.NODE_ENV !== "production") globalThis.prisma2 = prisma2;
"@

$prisma2Path = "server\utils\prisma2.ts"
if (Test-Path $prisma2Path) {
    Write-Host "File $prisma2Path already exists. Skipping..." -ForegroundColor Yellow
} else {
    Set-Content -Path $prisma2Path -Value $prisma2Content -Encoding UTF8
    Write-Host "✓ Created $prisma2Path" -ForegroundColor Green
}

# 3. Update package.json
Write-Host "Updating package.json..." -ForegroundColor Yellow
$packageJsonPath = "package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    
    # Check if scripts already exist
    if (-not $packageJson.scripts.'prisma:generate:main') {
        # Add new scripts
        $packageJson.scripts | Add-Member -MemberType NoteProperty -Name "prisma:generate:main" -Value "npx prisma db pull && npx prisma generate" -Force
        $packageJson.scripts | Add-Member -MemberType NoteProperty -Name "prisma:generate:second" -Value "npx prisma generate --schema=prisma/schema2.prisma" -Force
        $packageJson.scripts | Add-Member -MemberType NoteProperty -Name "prisma:generate:all" -Value "yarn prisma:generate:main && yarn prisma:generate:second" -Force
        $packageJson.scripts | Add-Member -MemberType NoteProperty -Name "prisma:pull:second" -Value "npx prisma db pull --schema=prisma/schema2.prisma" -Force
        
        # Update existing prisma:generate script
        $packageJson.scripts.'prisma:generate' = "npx prisma db pull && npx prisma generate && npx prisma generate --schema=prisma/schema2.prisma"
        
        # Convert back to JSON with proper formatting
        $jsonContent = $packageJson | ConvertTo-Json -Depth 10
        # Fix formatting to match original style (2 spaces indentation)
        $jsonContent = $jsonContent -replace '  ', '  ' | ForEach-Object {
            $_ -replace '": "', '": "' `
               -replace '": {', '": {' `
               -replace '": \[', '": [' `
               -replace '": ', '": '
        }
        
        Set-Content -Path $packageJsonPath -Value $jsonContent -Encoding UTF8
        Write-Host "✓ Updated package.json with new Prisma scripts" -ForegroundColor Green
    } else {
        Write-Host "package.json already has the new scripts. Skipping..." -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Error: package.json not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Add DATABASE_URL2 to your .env file:" -ForegroundColor White
Write-Host "   DATABASE_URL2=`"mysql://user:password@localhost:3306/database2`"" -ForegroundColor Gray
Write-Host "2. Generate Prisma clients:" -ForegroundColor White
Write-Host "   yarn prisma:generate:all" -ForegroundColor Gray
Write-Host "3. Use the second client in your code:" -ForegroundColor White
Write-Host "   import prisma2 from '~/server/utils/prisma2';" -ForegroundColor Gray
