import { upload } from './src/middleware/upload.middleware.js';
import express from 'express';

const app = express();
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ success: true, file: req.file });
});
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(500).json({ error: err.message });
});
const server = app.listen(5001, () => {
  import('child_process').then(({ exec }) => {
    exec('curl.exe -X POST http://localhost:5001/upload -F "image=@dummy.png"', (error, stdout, stderr) => {
      console.log('CURL OUTPUT:', stdout);
      console.log('CURL STDERR:', stderr);
      server.close();
      process.exit(0);
    });
  });
});
