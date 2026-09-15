const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

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
            const result = babel.transformFileSync(filePath, {
                plugins: [
                    ['@babel/plugin-transform-typescript', { isTSX: filePath.endsWith('.tsx') }]
                ],
                retainLines: true, // Keep it readable
                generatorOpts: {
                    retainLines: true
                }
            });
            
            fs.writeFileSync(newPath, result.code);
            fs.unlinkSync(filePath); // delete original
        } catch (e) {
            console.error(`Error processing ${filePath}:`, e);
        }
    }
});
