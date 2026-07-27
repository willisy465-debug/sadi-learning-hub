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

// Regex patterns to match different prefixes (text, bg, border, shadow, focus:border, focus:ring)
// and colors
const replacements = [
    // Purples (Accents)
    { regex: /(text|bg|border)-amber-(400|500|600)/g, replace: '$1-udemy-purple' },
    { regex: /(text|bg|border)-blue-(500|600)/g, replace: '$1-udemy-purple' },
    { regex: /(text|bg|border)-indigo-(500|600)/g, replace: '$1-udemy-purple' },
    
    // Dark Purples (Hovers)
    { regex: /(text|bg|border)-blue-700/g, replace: '$1-udemy-darkPurple' },
    { regex: /(text|bg|border)-indigo-700/g, replace: '$1-udemy-darkPurple' },
    { regex: /(text|bg|border)-amber-700/g, replace: '$1-udemy-darkPurple' },
    
    // Blacks
    { regex: /(text|bg|border)-slate-900/g, replace: '$1-udemy-black' },
    { regex: /(text|bg|border)-gray-900/g, replace: '$1-udemy-black' },
    
    // Grays (Light Backgrounds)
    { regex: /(text|bg|border)-slate-50\b/g, replace: '$1-udemy-gray' },
    { regex: /(text|bg|border)-slate-100\b/g, replace: '$1-udemy-gray' },
    { regex: /(text|bg|border)-gray-50\b/g, replace: '$1-udemy-gray' },
    { regex: /(text|bg|border)-gray-100\b/g, replace: '$1-udemy-gray' },
    
    // Gray Borders
    { regex: /(text|bg|border)-slate-200/g, replace: '$1-udemy-grayBorder' },
    { regex: /(text|bg|border)-gray-200/g, replace: '$1-udemy-grayBorder' },

    // Special cases with opacity or focus states
    { regex: /shadow-amber-(400|500)\/20/g, replace: 'shadow-udemy-purple/20' },
    { regex: /(bg|border)-amber-500\/([0-9]{2})/g, replace: '$1-udemy-purple/$2' },
    { regex: /focus:border-amber-400/g, replace: 'focus:border-udemy-purple' },
    { regex: /focus:ring-amber-400\/20/g, replace: 'focus:ring-udemy-purple/20' },
    { regex: /focus:border-blue-[456]00/g, replace: 'focus:border-udemy-purple' },
    { regex: /focus:ring-blue-[456]00\/20/g, replace: 'focus:ring-udemy-purple/20' },
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
