const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // Netlify (AWS Lambda) ortamındaki olası tüm kök dizinleri tanımlayalım
    const baseDir = process.env.LAMBDA_TASK_ROOT || process.cwd();
    
    // Klasörün saklanmış olabileceği tüm olası yollar:
    const possiblePaths = [
        path.join(baseDir, 'images', 'nonvideo'),
        path.join(baseDir, 'public', 'images', 'nonvideo'),
        path.join(__dirname, '..', '..', 'images', 'nonvideo'),
        path.join('/var/task', 'images', 'nonvideo')
    ];

    let targetDir = null;
    for (let p of possiblePaths) {
        if (fs.existsSync(p)) {
            targetDir = p;
            break;
        }
    }

    // Eğer hiçbir yolda bulamazsa hata logu atıp boş liste dönsün (çökmesin)
    if (!targetDir) {
        console.log("HATA: Klasör bulunamadı! Aranan yollar:", possiblePaths);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify([])
        };
    }

    const getAllImages = (dirPath, arrayOfFiles = []) => {
        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
            const fullPath = path.join(dirPath, file);
            
            if (fs.statSync(fullPath).isDirectory()) {
                arrayOfFiles = getAllImages(fullPath, arrayOfFiles);
            } else {
                if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
                    // İşletim sistemine göre ters/düz slash sorununu çözüyoruz
                    const urlPath = `/images/nonvideo/` + fullPath.split(/nonvideo[\\\/]/)[1].replace(/\\/g, '/');
                    arrayOfFiles.push(urlPath);
                }
            }
        });

        return arrayOfFiles;
    };

    try {
        const images = getAllImages(targetDir);
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(images)
        };
    } catch (error) {
        console.error("Görsel tarama hatası:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify([])
        };
    }
};
