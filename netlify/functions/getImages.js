const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        const baseDir = path.join(process.cwd(), 'images', 'nonvideo');
        
        // DEDEKTİF 1: Klasör gerçekten sunucuda var mı?
        if (!fs.existsSync(baseDir)) {
            let icindekiler = "Images klasörü bile bulunamadı!";
            const imgDir = path.join(process.cwd(), 'images');
            if (fs.existsSync(imgDir)) {
                // Sunucudaki images klasöründe tam olarak hangi dosyalar/klasörler var bakalım:
                icindekiler = fs.readdirSync(imgDir).join(', ');
            }
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(["HATA_1: nonvideo klasörü sunucuda YOK! images klasörünün içinde sadece şunlar var: " + icindekiler])
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
                        const relativePath = path.relative(process.cwd(), fullPath);
                        const urlPath = '/' + relativePath.replace(/\\/g, '/');
                        arrayOfFiles.push(urlPath);
                    }
                }
            });
            return arrayOfFiles;
        };

        const images = getAllImages(baseDir);
        
        // DEDEKTİF 2: Klasör var ama içi boş mu?
        if (images.length === 0) {
             return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(["HATA_2: nonvideo klasörü var ama içinde hiçbir görsel (jpg, png vb.) bulamadım!"])
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(images)
        };

    } catch (error) {
        // DEDEKTİF 3: Kodda bir çökme mi var?
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(["HATA_3: Kod çöktü! Detay: " + error.message])
        };
    }
};
