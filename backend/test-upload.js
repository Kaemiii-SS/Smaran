async function test() {
  try {
    // 1. Register a test user
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        username: 'testuser123',
        email: 'test12345@test.com',
        password: 'password123',
        role: 'Patient'
      })
    });
    const regData = await regRes.json();
    console.log('Register:', regRes.status, regData);
    
    let token = regData.token;
    if (!token) {
        // try login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test12345@test.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        token = loginData.token;
    }

    // 2. Upload without file
    const uploadRes = await fetch('http://localhost:5000/api/memory/upload', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer ' + token
      }
    });
    console.log('Upload empty:', uploadRes.status, await uploadRes.text());
  } catch (e) {
    console.error(e);
  }
}
test();
