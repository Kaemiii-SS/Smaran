const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/game_5/src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let fileDir = path.dirname(filePath);
        
        let relativeToSrc = path.relative(fileDir, srcDir).replace(/\\/g, '/');
        if (relativeToSrc === '') relativeToSrc = '.';
        
        let newContent = content.replace(/@\//g, relativeToSrc + '/');
        newContent = newContent.replace(/["']use client["'];?\n?/g, '');
        
        if (content !== newContent) {
            console.log(`Updated ${filePath}`);
            fs.writeFileSync(filePath, newContent);
        }
    }
});
