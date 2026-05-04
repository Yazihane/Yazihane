const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // Netlify ortamında static klasörlerin yolunu bulmak için olası dizinleri kontrol ediyoruz.
    const dir1 = path.join(process.cwd(), 'images', 'nonvideo');
    const dir2 = path.join(__dirname, '..', '..', 'images', 'nonvideo');
    
    // Hangi dizin geçerliyse onu seçiyoruz.
    let targetDir = fs.existsSync(dir1) ? dir1 : (fs.existsSync(dir2) ? dir2 : null);

    // Klasör bulunamazsa sitenin çökmemesi için boş dizi dönüyoruz.
    if (!targetDir) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([])
        };
    }

    // Klasörleri iç içe (recursive) okuyan dedektif fonksiyonumuz
    const getAllImages = (dirPath, arrayOfFiles = []) => {
        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
            const fullPath = path.join(dirPath, file);
            
            // Eğer bu bir klasörse, içine girip tekrar tara
            if (fs.statSync(fullPath).isDirectory()) {
                arrayOfFiles = getAllImages(fullPath, arrayOfFiles);
            } else {
                // Sadece görsel formatlarını filtrele (Büyük/küçük harf duyarsız)
                if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
                    // Sunucudaki karmaşık dosya yolunu, tarayıcının anlayacağı URL yoluna çevir
                    // Örnek: /var/task/images/nonvideo/turizm/foto/afis.jpg -> /images/nonvideo/turizm/foto/afis.jpg
                    const urlPath = `/images/nonvideo/` + fullPath.split(`nonvideo${path.sep}`)[1].replace(/\\/g, '/');
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([])
        };
    }
};