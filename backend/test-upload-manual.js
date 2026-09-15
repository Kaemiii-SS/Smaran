import fs from 'fs';

async function test() {
  try {
    // 1. Login to get token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test12345@test.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    // Create a real multipart form manually to avoid fetch/form-data module issues
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let body = '';
    body += '--' + boundary + '\r\n';
    body += 'Content-Disposition: form-data; name="patientId"\r\n\r\n';
    body += '123456\r\n';
    body += '--' + boundary + '\r\n';
    body += 'Content-Disposition: form-data; name="title"\r\n\r\n';
    body += 'Test Title\r\n';
    body += '--' + boundary + '\r\n';
    body += 'Content-Disposition: form-data; name="image"; filename="dummy.png"\r\n';
    body += 'Content-Type: image/png\r\n\r\n';
    body += 'fake image content\r\n';
    body += '--' + boundary + '--\r\n';

    const uploadRes = await fetch('http://localhost:5000/api/memory/upload', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      },
      body: body
    });
    console.log('Upload file:', uploadRes.status, await uploadRes.text());
  } catch (e) {
    console.error(e);
  }
}
test();
