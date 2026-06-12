const fs = require('fs');

const files = [
    "src/Components/Tour/TourInner.jsx",
    "src/Components/Tour/TourDetailsMain.jsx",
    "src/Components/Services/ServiceDetailsMain.jsx",
    "src/Components/Resort/ResortDetailsMain.jsx",
    "src/Components/Destination/DestinationInner.jsx",
    "src/Components/Destination/DestinationDetailsMain.jsx",
    "src/Components/Blog/BlogDetailsMain.jsx",
    "src/Components/Activities/ActivitiesDetailsMain.jsx"
];

const basePath = "d:\\tourm-travel-tour-booking-agency-reactjs-templ-2026-05-24-11-15-14-utc\\download-version\\download-version\\tourm\\";

files.forEach(file => {
    const fullPath = basePath + file;
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    let modified = false;

    // Check if lucide-react is already imported
    if (!content.includes('from \'lucide-react\'') && !content.includes('from "lucide-react"')) {
        content = "import { ArrowRight } from 'lucide-react';\n" + content;
        modified = true;
    } else if (content.includes('lucide-react') && !content.includes('ArrowRight')) {
        content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];?/, (match, p1) => {
            return `import { ${p1}, ArrowRight } from 'lucide-react';`;
        });
        modified = true;
    }

    // Target the specific Read More button in the Need Help section
    // <Link to="/contact" className="th-btn style2 th-icon">\n  Read More\n</Link>
    
    if (content.includes('Read More') && content.includes('/contact')) {
        // Find the precise Read More button in the widget and remove th-icon
        // Just replacing all 'Read More' buttons that have th-icon
        
        let oldContent = content;
        content = content.replace(/(className=["'][^"']*)th-icon([^"']*["'][^>]*>)\s*Read More\s*<\/Link>/g, 
            '$1$2 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>Read More <ArrowRight size={16} /></Link>'
        );
        
        if (oldContent !== content) {
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Updated: " + file);
    }
});
console.log("Done");
