const fs = require('fs');

const files = [
    "src/Components/Tour/TourTwo.jsx",
    "src/Components/Tour/TourOne.jsx",
    "src/Components/Sale/SaleOne.jsx",
    "src/Components/Services/ServiceDetailsMain.jsx",
    "src/Components/Services/ServiceCard.jsx",
    "src/Components/Resort/ResortInner.jsx",
    "src/Components/Resort/ResortCard.jsx",
    "src/Components/Flight/FlightCard.jsx",
    "src/Components/Destination/DestinationCardTwo.jsx",
    "src/Components/Destination/PopularDestination.jsx",
    "src/Components/Destination/DestinationCard.jsx",
    "src/Components/Destination/DestinationDetailsMain.jsx",
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
        // Add import at the top
        content = "import { ArrowRight } from 'lucide-react';\n" + content;
        modified = true;
    } else if (content.includes('lucide-react') && !content.includes('ArrowRight')) {
        // Append ArrowRight to existing import
        content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];?/, (match, p1) => {
            return `import { ${p1}, ArrowRight } from 'lucide-react';`;
        });
        modified = true;
    }

    // Remove 'th-icon' class
    if (content.includes('th-icon')) {
        content = content.replace(/className=(["'])(.*?)\bth-icon\b(.*?)\1/g, (match, p1, p2, p3) => {
            return `className=${p1}${p2}${p3}${p1}`.replace(/\s+/g, ' '); // Clean up extra spaces
        });
        modified = true;
    }

    // Replace ">Book Now<" or ">\nBook Now\n<"
    if (content.match(/>\s*Book Now\s*</)) {
        content = content.replace(/>\s*Book Now\s*</g, ' style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>Book Now <ArrowRight size={16} /><');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Updated: " + file);
    }
});
console.log("Done");
