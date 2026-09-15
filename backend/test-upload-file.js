import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';

async function test() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test12345@test.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    // 2. Upload with file
    fs.writeFileSync('dummy.jpg', 'fake image content');
    const formData = new FormData();
    formData.append('patientId', '123456');
    formData.append('title', 'Test');
    formData.append('description', 'Desc');
    formData.append('image', fs.createReadStream('dummy.jpg'));

    const uploadRes = await fetch('http://localhost:5000/api/memory/upload', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer ' + token
      },
      body: formData
    });
    console.log('Upload file:', uploadRes.status, await uploadRes.text());
  } catch (e) {
    console.error(e);
  }
}
test();
