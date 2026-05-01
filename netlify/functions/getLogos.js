const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Netlify sunucusunda ana proje dizininden logolar klasörüne ulaşıyoruz
        const dirPath = path.join(process.cwd(), 'images', 'logolar');
        
        // Klasörün içindeki tüm dosyaları saniyeden kısa sürede okuyoruz
        const dosyalar = fs.readdirSync(dirPath);
        
        // Sadece işimize yarayan görsel formatlarını filtreliyoruz
        const logolar = dosyalar.filter(dosya => /\.(png|jpe?g|svg|webp)$/i.test(dosya));
        
        // Logoların tam isimlerini siteye şak diye gönderiyoruz
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(logolar)
        };

    } catch (error) {
        // Klasör yoksa veya hata olursa sistem çökmesin, boş liste göndersin (Sıfır 404)
        console.error("Logo okuma hatası:", error);
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