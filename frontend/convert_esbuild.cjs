const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

walkDir(path.join(__dirname, 'src/game_5/src'), (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let ext = filePath.endsWith('.tsx') ? '.jsx' : '.js';
        let newPath = filePath.substring(0, filePath.lastIndexOf('.')) + ext;
        
        console.log(`Converting ${filePath} to ${newPath}`);
        
        try {
            let cmd = `npx esbuild "${filePath}" --outfile="${newPath}" --format=esm`;
            if (filePath.endsWith('.tsx')) {
                cmd += ` --jsx=preserve`;
            }
            execSync(cmd, { stdio: 'inherit' });
            
            // Wait, we need to delete the original file but only if it's not the same path
            if (filePath !== newPath) {
                fs.unlinkSync(filePath); // delete original
            }
        } catch (e) {
            console.error(`Error processing ${filePath}:`, e.message);
        }
    }
});
