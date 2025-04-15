$headers = @{
    "Content-Type" = "application/json"
}

$timestamp = Get-Date -Format 'yyyyMMddHHmmssff'

# Simplify to the absolute minimum required fields
$body = @{
    username = "test$timestamp"
    email = "test$timestamp@example.com"
    password = "Password123!"
    confirmPassword = "Password123!"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Write-Host "Testing API with payload:"
Write-Host $body

$url = "https://dotnetcrud-production.up.railway.app/api/Auth/register"
Write-Host "Sending request to: $url"

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $body -ContentType "application/json" -TimeoutSec 30 -Verbose
    
    Write-Host "Status code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status code: $statusCode"
        
        try {
            $responseBody = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($responseBody)
            $responseContent = $reader.ReadToEnd()
            Write-Host "Error response: $responseContent"
            
            # Try to parse the response content as JSON
            try {
                $parsedContent = $responseContent | ConvertFrom-Json
                Write-Host "Parsed error content:" 
                $parsedContent | Format-List
            } catch {
                Write-Host "Could not parse response content as JSON: $_"
            }
        } catch {
            Write-Host "Could not read response body: $_"
        }
    }
} 