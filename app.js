/* =========================================
   YAZIHANE CREATIVE - THE ULTIMATE SPA ENGINE
========================================= */

// --- 1. KÜRESEL DEĞİŞKENLER VE DURUMLAR ---
let currentLang = localStorage.getItem('yazihane_lang') || 'tr';
let globalVideoCache = [];
let isVideosLoaded = false;
let ytPlayer = null;
let ytInterval = null;

// --- 2. AKILLI DİJİTAL SAAT (MESAİ KONTROLÜ) ---
function updateSmartClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });
    const hour = now.getHours(); 
    
    const timeEl = document.getElementById('local-time');
    const dotEl = document.getElementById('status-dot');
    
    if(timeEl && dotEl) {
        timeEl.innerText = timeString;
        // 10:00 - 19:00 arası YEŞİL (Açık), Değilse KIRMIZI (Kapalı)
        if (hour >= 10 && hour < 19) {
            dotEl.className = 'status-dot open';
            timeEl.className = 'digital-clock clock-open';
        } else {
            dotEl.className = 'status-dot closed';
            timeEl.className = 'digital-clock clock-closed';
        }
    }
}
setInterval(updateSmartClock, 1000);
updateSmartClock();

// --- 3. ÇOK DİLLİ YAPI (i18n) SÖZLÜĞÜ ---
const i18n = {
    tr: { 
        nav_home: "ANA SAYFA", nav_work: "PORTFOLYO", nav_about: "HAKKIMIZDA", nav_services: "HİZMETLERİMİZ", nav_careers: "KARİYER", nav_contact: "İLETİŞİM", ticker_text: "CREATIVE REVOLUTION — 2026 — YAZIHANE", footer_contact: "BİZEULAŞIN", leg_1: "KULLANIM KOŞULLARI", leg_2: "GİZLİLİK POLİTİKASI", leg_3: "ÇEREZ POLİTİKASI", copy: "2026 © HER HAKKI YAZIHANE REKLAM AJANSI'NA AİTTİR.",
        role_founder: "Kurucu", role_gm: "Genel Müdür", role_cd: "Kreatif Müdür", role_marketing: "Marketing & Business Dev.", role_ad: "Art Director", role_hgd: "Head of Graphic Design", role_video: "Videographer", role_gd: "Graphic Designer", role_social: "Social Media",
        man_1: "Biz Yazıhaneyiz.", man_2: "Sadece reklam endüstrisi için doğmadık;", man_3: "gerçek dünyada, sahada büyüdük.", man_4: "Bu yüzden ürettiğimiz her şey; markalara derinlik katan, el yapımı hikayelerden oluşur.", man_link: "HAKKIMIZDA DAHA FAZLASI ↗", team_title: "BİZ KİMİZ", brands_title: "ÇÖZÜM ORTAKLARIMIZ",
        ab_hero_1: "SÖYLEYECEK", ab_hero_2: "SÖZÜ OLANLAR", ab_hero_3a: "İÇİN", ab_hero_3b: "BURADAYIZ.", ab_hero_red_1: "Herkesin Bir", ab_hero_red_2: "Hikayesi Vardır", ab_hero_est: "2016'DAN BERİ", 
        ab_intro_title: "Biz Yazıhaneyiz.", ab_intro_sub_1: "Küresel çapta bir", ab_intro_sub_2: "Kreatif Ajans", ab_intro_p: "Farklı disiplinlerde uzmanlaşmış kreatif bir ekip olarak markaların var olan hikayelerini keşfetmeyi ya da baştan yaratmayı ve dijital dünyanın inovatif dinamiklerini kullanarak hedef kitlelerine anlatmayı çok seviyoruz.", ab_intro_link: "HİZMETLERİMİZ ↗",
        ab_hww_bg: "NASIL<br>YAPTIK?", ab_hww_1: "PROAKTİFLİK", ab_hww_2: "TUTKU", ab_hww_3: "PERFORMANS", ab_hww_link: "NELER YAPTIK? ↗", ab_team_title: "BİZ KİMİZ", ab_team_desc: "Bugüne dek bize güvenen marka sayısı.",
        port_hero: "<span class='color-wipe'>Hangi sektörde</span> hikaye yaratıyoruz?", sec_turizm: "Turizm", sec_tekstil: "Tekstil", sec_saglik: "Sağlık", sec_insaat: "İnşaat", sec_eglence: "Eğlence", sec_emlak: "Emlak", sec_finans: "Finans", sec_egitim: "Eğitim", sec_lojistik: "Lojistik", sec_medya: "Medya", sec_mimari: "Mimari", sec_all: "Tüm İşlerimize Göz Atın", port_back: "Geri Dön", logo_title: "Değer Katanlar",
        srv_hero_1: "BİZ", srv_hero_2: "DİJİTAL", srv_hero_3: "ÇÖZÜM UZMANLARIYIZ", srv_intro_p: "Yazıhane olarak biz de çalıştığımız tüm markalarımıza aynı özveri ve samimiyetle yaklaşıyor...", srv_list_title: "HİZMETLERİMİZ", srv_back: "DİĞER HİZMETLER",
        srv_1_title: "360° Hizmet", srv_2_title: "Video Prodüksiyon", srv_3_title: "Sosyal Medya Yönetimi", srv_4_title: "Grafik Tasarım", srv_5_title: "Kreatif Çözümler", srv_6_title: "Dijital Pazarlama ve Reklam",
        car_title_1: "COURAGEOUS", car_title_2: "PROVOCATIVE", car_dna: "THAT'S OUR DNA", car_statement: "<span class='red'>Yazıhane</span> kendisini alışılagelmiş konseptlerle sınırlamadan projeler üreten <span class='red'>360° reklam ajansıdır.</span>", car_desc: "Şekillenmesine yardımcı olabileceğin bir ajansa katılmaya hazırsan bizimle iletişime geç.", car_link: "Hemen CV'ni gönder! ↗", fu_title: "BİZİ TAKİP EDİN"
    },
    en: { 
        nav_home: "HOME", nav_work: "WORK", nav_about: "ABOUT", nav_services: "SERVICES", nav_careers: "CAREERS", nav_contact: "CONTACT", ticker_text: "CREATIVE REVOLUTION — 2026 — YAZIHANE", footer_contact: "REACH OUT", leg_1: "TERMS OF USE", leg_2: "PRIVACY POLICY", leg_3: "COOKIES POLICY", copy: "2026 © ALL RIGHTS RESERVED BY YAZIHANE.",
        role_founder: "Founder", role_gm: "General Manager", role_cd: "Creative Director", role_marketing: "Marketing & Business Dev.", role_ad: "Art Director", role_hgd: "Head of Graphic Design", role_video: "Videographer", role_gd: "Graphic Designer", role_social: "Social Media",
        man_1: "We are Yazıhane.", man_2: "Born not just for the ad industry;", man_3: "raised in the real world.", man_4: "That's why everything we produce consists of handmade stories that add depth.", man_link: "MORE ABOUT US ↗", team_title: "WHO WE ARE", brands_title: "SOLUTION PARTNERS",
        ab_hero_1: "WE ARE HERE", ab_hero_2: "FOR THOSE", ab_hero_3a: "WHO HAVE", ab_hero_3b: "A WORD TO SAY.", ab_hero_red_1: "Everyone Has", ab_hero_red_2: "A Story", ab_hero_est: "SINCE 2016", 
        ab_intro_title: "We are Yazıhane.", ab_intro_sub_1: "A global scale", ab_intro_sub_2: "Creative Agency", ab_intro_p: "As a creative team specializing in various disciplines, we love discovering stories...", ab_intro_link: "OUR SERVICES ↗",
        ab_hww_bg: "HOW WE<br>WORK?", ab_hww_1: "PROACTIVITY", ab_hww_2: "PASSION", ab_hww_3: "PERFORMANCE", ab_hww_link: "VIEW OUR WORK ↗", ab_team_title: "WHO WE ARE", ab_team_desc: "Brands that have trusted us.",
        port_hero: "<span class='color-wipe'>In which sector</span> do we create stories?", sec_turizm: "Tourism", sec_tekstil: "Textile", sec_saglik: "Healthcare", sec_insaat: "Construction", sec_eglence: "Entertainment", sec_emlak: "Real Estate", sec_finans: "Finance", sec_egitim: "Education", sec_lojistik: "Logistics", sec_medya: "Media", sec_mimari: "Architecture", sec_all: "Browse All Our Work", port_back: "Go Back", logo_title: "Value Adders",
        srv_hero_1: "WE ARE", srv_hero_2: "DIGITAL", srv_hero_3: "SOLUTION EXPERTS", srv_intro_p: "At Yazıhane, we approach all brands with dedication...", srv_list_title: "OUR SERVICES", srv_back: "OTHER SERVICES",
        srv_1_title: "360° Services", srv_2_title: "Video Production", srv_3_title: "Social Media Management", srv_4_title: "Graphic Design", srv_5_title: "Creative Solutions", srv_6_title: "Digital Marketing",
        car_title_1: "COURAGEOUS", car_title_2: "PROVOCATIVE", car_dna: "THAT'S OUR DNA", car_statement: "<span class='red'>Yazıhane</span> is a <span class='red'>360° ad agency</span> producing unique projects.", car_desc: "If you're ready to join us, get in touch.", car_link: "Send your CV! ↗", fu_title: "FOLLOW US"
    }
};

window.setLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('yazihane_lang', lang);
    document.documentElement.lang = lang; 

    // Dil Menüsü Butonlarını Güncelle
    document.querySelectorAll('.lang-btn, .lang-btn-mobile').forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.lang-btn[data-lang="${lang}"], .lang-btn-mobile[data-lang="${lang}"]`).forEach(b => b.classList.add('active'));
    
    // Geçerli Dili Ekrana Yazdır
    const desktopCurrent = document.getElementById('desktop-lang-current-text');
    if(desktopCurrent) desktopCurrent.innerHTML = `${lang.toUpperCase()} <span style="font-size: 8px;">▼</span>`;
    const mobileCurrent = document.querySelector('.mobile-lang-current');
    if(mobileCurrent) mobileCurrent.innerHTML = `${lang.toUpperCase()} <span style="font-size: 8px;">▼</span>`;

    // i18n Etiketlerini Çevir (Router sonrası DOM güncellendiği için)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        if(i18n[lang] && i18n[lang][el.dataset.i18n]) {
            el.innerHTML = i18n[lang][el.dataset.i18n];
        }
    });

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.style.fontFamily = lang === 'ar' ? "'Space Grotesk', sans-serif" : "'Inter', sans-serif";
};

// --- 4. YOUTUBE HASHTAG SİLİCİ (Zeka) ---
function cleanProjectName(rawTitle) {
    // Sadece '#' ile başlayan kelimeleri siler, markayı tertemiz bırakır
    return rawTitle.replace(/#[\p{L}\p{M}\.\-_0-9]+/giu, '').replace(/\s+/g, ' ').trim();
}

async function fetchAllVideos() {
    if (isVideosLoaded) return globalVideoCache;
    try {
        const res = await fetch(`/.netlify/functions/youtube?ts=${Date.now()}`);
        if(res.ok) {
            const data = await res.json();
            globalVideoCache = data.map(v => ({
                ...v,
                cleanClientName: cleanProjectName(v.title) // Tertemiz Müşteri İsmi (Kempinski vs.)
            }));
            isVideosLoaded = true;
        }
    } catch(e) { console.error("YouTube veri çekme hatası:", e); }
    return globalVideoCache;
}

// --- 5. SCROLL ANİMASYONLARI BAŞLATICI ---
function initScrollAnimations() {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('turn-red')) {
                    setTimeout(() => entry.target.classList.add('active'), 600);
                }
            }
        });
    }, { threshold: 0.1 }); 
    
    document.querySelectorAll('.reveal-up, .reveal-fade, .turn-red').forEach(el => scrollObserver.observe(el));
}

// --- 6. GLOBAL OLARAK KULLANILACAK FONKSİYONLAR (ONCLICK İÇİN) ---

// Portfolio Sektör Filtreleme
window.navigateTo = function(sector) {
    const viewEntry = document.getElementById('view-entry');
    const viewPortfolio = document.getElementById('view-portfolio');
    if(!viewEntry || !viewPortfolio) return;

    if (sector === '') {
        viewPortfolio.style.display = 'none';
        viewEntry.style.display = 'flex';
        window.scrollTo(0,0);
    } else {
        viewEntry.style.display = 'none';
        viewPortfolio.style.display = 'block';
        document.getElementById('sector-display-name').innerText = sector.toUpperCase();
        window.scrollTo(0,0);
        // Burada videoları filtreleyip gride basma kodu eklenebilir.
    }
};

// Hizmetler Sayfası Detay Görünümü
window.openService = function(serviceId) {
    const listView = document.getElementById('services-list-view');
    const detailView = document.getElementById('service-detail-view');
    const titleEl = document.getElementById('sd-title');
    
    if(!listView || !detailView) return;
    
    listView.style.display = 'none';
    detailView.style.display = 'flex';
    
    // Tıklanan servisin ismini al
    const serviceNameKey = serviceId + '_title';
    titleEl.innerText = i18n[currentLang][serviceNameKey] || serviceId;
    window.scrollTo({top: 0, behavior: 'smooth'});
};

window.closeService = function() {
    const listView = document.getElementById('services-list-view');
    const detailView = document.getElementById('service-detail-view');
    if(!listView || !detailView) return;
    detailView.style.display = 'none';
    listView.style.display = 'block';
    window.scrollTo({top: 0, behavior: 'smooth'});
};

// --- 7. SPA ROUTER (SAYFA GEÇİŞ MOTORU) ---
const appRoot = document.getElementById('app-root');

// Bütün menü linkleri router'a bağlandı (Event Delegation ile)
document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if(link) {
        e.preventDefault();
        const path = link.getAttribute('data-link');
        loadPage(path);
        
        // Mobildeysek menüyü kapat
        const mobileMenu = document.getElementById('mobile-menu-overlay');
        if(mobileMenu) mobileMenu.classList.remove('active');
    }
});

async function loadPage(path) {
    if(!appRoot) return;
    appRoot.classList.add('page-loading'); // Ekranı Blurla
    
    try {
        const response = await fetch(`/pages${path}.html`);
        if (!response.ok) throw new Error('Sayfa bulunamadı');
        const html = await response.text();
        
        setTimeout(() => {
            appRoot.innerHTML = html;
            window.scrollTo(0, 0); 
            appRoot.classList.remove('page-loading'); 
            
            // Sayfa içeriği yenilendi, zekayı yeniden kur:
            initScrollAnimations();
            window.setLanguage(currentLang); // Mevcut dile göre çevirileri uygula
            
            // Portfolyo sayfası açıldıysa sektör butonlarını dinle
            if(path === '/portfolio') {
                document.querySelectorAll('.sector-item').forEach(item => {
                    item.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        window.navigateTo(ev.target.getAttribute('data-sector'));
                    });
                });
            }
            
        }, 300); // Hızlı geçiş
        
    } catch (error) {
        console.error("Router Hatası:", error);
        appRoot.innerHTML = `<h2 style="text-align:center; padding:150px 20px; font-family:'Big Shoulders Display'; font-size:3rem;">GÜNCELLEME YAPILIYOR...</h2>`;
        appRoot.classList.remove('page-loading');
    }
}

// --- 8. BAŞLANGIÇ AYARLARI (İLK YÜKLEME) ---
window.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dili Ayarla
    window.setLanguage(currentLang);
    
    // 2. Ana Sayfayı Yükle
    loadPage('/home');   
    
    // 3. Arka planda sessizce Youtube videolarını çek (Hashtagsiz, markaya özel)
    fetchAllVideos();    
    
    // 4. Header'daki dil açılır menülerini bağla
    document.body.addEventListener('click', (e) => {
        // Dil değiştirme butonları
        if (e.target.classList.contains('lang-btn') || e.target.classList.contains('lang-btn-mobile')) {
            window.setLanguage(e.target.dataset.lang);
        }
        
        // Masaüstü Dropdown
        const dtTrigger = e.target.closest('#desktop-lang-trigger');
        if(dtTrigger) dtTrigger.classList.toggle('active');
        
        // Mobil Dropdown
        const mbTrigger = e.target.closest('#mobile-lang-trigger');
        if(mbTrigger) mbTrigger.classList.toggle('active');
        
        // Dropdown dışı tıklandığında menüleri kapat
        if(!dtTrigger && !mbTrigger) {
            const dtMenu = document.getElementById('desktop-lang-trigger');
            const mbMenu = document.getElementById('mobile-lang-trigger');
            if(dtMenu) dtMenu.classList.remove('active');
            if(mbMenu) mbMenu.classList.remove('active');
        }
    });

    // Mobil Hamburger Menü
    document.body.addEventListener('click', (e) => {
        const hamburgerBtn = e.target.closest('#mobile-hamburger-btn');
        const closeBtn = e.target.closest('#mobile-close-btn');
        const overlay = document.getElementById('mobile-menu-overlay');
        
        if(hamburgerBtn && overlay) overlay.classList.add('active');
        if(closeBtn && overlay) overlay.classList.remove('active');
    });
});