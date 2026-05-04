const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // getLogos.js'de kusursuz çalışan dizin bulma mantığını birebir kullanıyoruz
        const baseDir = path.join(process.cwd(), 'images', 'nonvideo');
        
        // Eğer sunucuda bu klasör henüz oluşmadıysa boş liste dön (çökme olmasın)
        if (!fs.existsSync(baseDir)) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify([])
            };
        }

        // Alt klasörlerin (turizm, eglence, foto, tsrm vs.) içine dalacak dedektif fonksiyon
        const getAllImages = (dirPath, arrayOfFiles = []) => {
            const files = fs.readdirSync(dirPath);

            files.forEach((file) => {
                const fullPath = path.join(dirPath, file);
                
                if (fs.statSync(fullPath).isDirectory()) {
                    // Eğer klasörse, kapısını aç ve içini taramaya devam et
                    arrayOfFiles = getAllImages(fullPath, arrayOfFiles);
                } else {
                    // Eğer dosyaysa ve bir görsel formatındaysa al
                    if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
                        // Dizin yolunu alıp tarayıcının anlayacağı URL'ye çeviriyoruz
                        // Örn: "images/nonvideo/turizm/foto/a.jpg" -> "/images/nonvideo/turizm/foto/a.jpg"
                        const relativePath = path.relative(process.cwd(), fullPath);
                        const urlPath = '/' + relativePath.replace(/\\/g, '/');
                        arrayOfFiles.push(urlPath);
                    }
                }
            });

            return arrayOfFiles;
        };

        // Bütün listeyi topla
        const images = getAllImages(baseDir);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(images)
        };

    } catch (error) {
        console.error("Görsel okuma hatası:", error);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify([])
        };
    }
};