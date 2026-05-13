# Fix nginx config script
$nginxConfPath = "E:\nginx-1.25.1\conf\nginx.conf"

# Read current config
$content = Get-Content $nginxConfPath -Raw

# Replace API proxy config
$oldApiConfig = 'location /api {'
$newApiConfig = 'location /api/ {'

$oldProxyPass = 'proxy_pass https://uat-history.mt7pp.com/api;'
$newProxyPass = @'
			proxy_pass https://uat-history.mt7pp.com/;
			proxy_set_header Host uat-history.mt7pp.com;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header X-Forwarded-Proto $scheme;
			proxy_ssl_verify off;
			proxy_ssl_server_name on;
			proxy_connect_timeout 30s;
			proxy_send_timeout 30s;
			proxy_read_timeout 30s;
'@

# Execute replacement
$content = $content -replace [regex]::Escape($oldApiConfig), $newApiConfig
$content = $content -replace [regex]::Escape($oldProxyPass), $newProxyPass

# Write fixed config
$content | Set-Content $nginxConfPath -Encoding UTF8

Write-Host "nginx config fixed!"
Write-Host "Please restart nginx service to apply changes." 