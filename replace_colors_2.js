const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

const replacements = [
    // Hex codes in CoursesMarketplaceClient and other places
    { regex: /#060097/g, replace: '#5624d0' }, // Dark blue -> udemy purple
    { regex: /#00b1f8/g, replace: '#5624d0' }, // Cyan -> udemy purple
    
    // Gradients
    { regex: /from-amber-(400|500|600)/g, replace: 'from-udemy-purple' },
    { regex: /to-yellow-(400|500|600)/g, replace: 'to-udemy-darkPurple' },
    
    // Remaining amber/yellow/blue/indigo
    { regex: /(text|bg|border)-blue-400/g, replace: '$1-udemy-purple' },
    { regex: /(text|bg|border)-indigo-400/g, replace: '$1-udemy-purple' },
    { regex: /(text|bg|border)-amber-300/g, replace: '$1-udemy-purple' },
    { regex: /(text|bg|border)-amber-400/g, replace: '$1-udemy-purple' },
    { regex: /(text|bg|border)-yellow-500/g, replace: '$1-udemy-purple' },
];

let totalModified = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const r of replacements) {
        content = content.replace(r.regex, r.replace);
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        totalModified++;
        console.log(`Updated ${file}`);
    }
}

console.log(`Total files modified: ${totalModified}`);
