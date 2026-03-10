const https = require('https');
const fs = require('fs');
const data = JSON.stringify({ jobRole: 'Software Engineer' });
const options = {
    hostname: 'resumecraft.co.in',
    path: '/api/ai/suggest',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    } 
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
        const result = {
            status: res.statusCode,
            body: body
        };
        fs.writeFileSync('api_error_full.json', JSON.stringify(result, null, 2));
        console.log('Result saved to api_error_full.json');
    });
});

req.on('error', (e) => console.error('Request Error:', e.message));
req.write(data);
req.end();
