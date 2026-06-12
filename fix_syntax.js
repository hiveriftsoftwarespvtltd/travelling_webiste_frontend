const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('d:\\tourm-travel-tour-booking-agency-reactjs-templ-2026-05-24-11-15-14-utc\\download-version\\download-version\\tourm\\src', function(filePath) {
    if (!filePath.endsWith('.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the malformed Read More buttons
    let oldContent = content;
    
    // Fix: > style={{ ... }}>
    content = content.replace(/>\s*style=\{\{\s*display:\s*["']inline-flex["'][^}]*\}\}>/g, ' style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>');
    
    if (oldContent !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Fixed: " + filePath);
    }
});
console.log("Done");
