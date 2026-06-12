const fs = require('fs');

const files = [
    "src/Pages/AdminLogin.jsx",
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

    if (content.includes('j iyo-logo.png') || content.includes('jiyo-logo.png') || content.includes('logo2.svg')) {
        content = content.replace(/src="\/assets\/img\/j\s*iyo-logo\.png"\s+alt="Tourm"/g, 'src="/assets/img/jiyo-logo-new.png" alt="Jiyo Life"');
        content = content.replace(/src="\/assets\/img\/jiyo-logo\.png"\s+alt="Tourm"/g, 'src="/assets/img/jiyo-logo-new.png" alt="Jiyo Life"');
        content = content.replace(/src="assets\/img\/logo2\.svg"\s+alt="Tourm"/g, 'src="/assets/img/jiyo-logo-new.png" alt="Jiyo Life"');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Updated: " + file);
    }
});
console.log("Done");
