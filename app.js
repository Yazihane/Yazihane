/* =========================================
   YAZIHANE CREATIVE - THE ULTIMATE SPA ENGINE
========================================= */

// --- 1. KÜRESEL DEĞİŞKENLER VE SAAT ---
let currentLang = localStorage.getItem('yazihane_lang') || 'tr';
let globalVideoCache = [];
let isVideosLoaded = false;
let ytPlayer = null;
let ytInterval = null;

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

// --- 2. ÇOK DİLLİ YAPI (i18n) ---
const i18n = {
    tr: { hero_title: "BİZ YAZIHANEYİZ", nav_home: "ANA SAYFA", nav_work: "PORTFOLYO", nav_about: "HAKKIMIZDA", nav_services: "HİZMETLERİMİZ", nav_careers: "KARİYER", nav_contact: "İLETİŞİM", ticker_text: "CREATIVE REVOLUTION — 2026 — YAZIHANE", man_1: "Biz Yazıhaneyiz.", man_2: "Sadece reklam endüstrisi için doğmadık;", man_3: "gerçek dünyada, sahada büyüdük.", man_4: "Bu yüzden ürettiğimiz her şey; markalara derinlik katan, el yapımı hikayelerden oluşur.", man_link: "HAKKIMIZDA DAHA FAZLASI ↗", team_title: "BİZ KİMİZ", role_founder: "Kurucu", role_gm: "Genel Müdür", role_cd: "Kreatif Müdür", role_marketing: "Marketing & Business Dev.", role_ad: "Art Director", role_hgd: "Head of Graphic Design", role_video: "Videographer", role_gd: "Graphic Designer", role_social: "Social Media", brands_title: "ÇÖZÜM ORTAKLARIMIZ", slo_meta_new: "EST. 2016", slo_1: "SÖYLEYECEK", slo_2: "SÖZÜ OLANLAR", slo_3: "İÇİN BURADAYIZ.", slo_red: "HERKESİN BİR HİKAYESİ VARDIR.", lbl_services: "HİZMETLERİMİZ", srv_1: "360° Hizmet", srv_2: "Video Prodüksiyon", srv_3: "Sosyal Medya Yönetimi", srv_4: "Grafik Tasarım", srv_5: "Kreatif Çözümler", srv_6: "Dijital Pazarlama ve Reklam", footer_contact: "BİZEULAŞIN", leg_1: "KULLANIM KOŞULLARI", leg_2: "GİZLİLİK POLİTİKASI", leg_3: "ÇEREZ POLİTİKASI", copy: "2026 © HER HAKKI YAZIHANE REKLAM AJANSI'NA AİTTİR.", ab_hero_1: "SÖYLEYECEK", ab_hero_2: "SÖZÜ OLANLAR", ab_hero_3a: "İÇİN", ab_hero_3b: "BURADAYIZ.", ab_hero_red_1: "Herkesin Bir", ab_hero_red_2: "Hikayesi Vardır", ab_hero_est: "2016'DAN BERİ", ab_intro_title: "Biz Yazıhaneyiz.", ab_intro_sub_1: "Küresel çapta bir", ab_intro_sub_2: "Kreatif Ajans", ab_intro_p: "Farklı disiplinlerde uzmanlaşmış kreatif bir ekip olarak markaların var olan hikayelerini keşfetmeyi ya da baştan yaratmayı ve dijital dünyanın inovatif dinamiklerini kullanarak hedef kitlelerine anlatmayı çok seviyoruz.", ab_intro_link: "HİZMETLERİMİZ ↗", ab_hww_bg: "NASIL<br>YAPTIK?", ab_hww_1: "PROAKTİFLİK", ab_hww_2: "TUTKU", ab_hww_3: "PERFORMANS", ab_hww_link: "NELER YAPTIK? ↗", ab_team_title: "BİZ KİMİZ", ab_team_desc: "Bugüne dek bize güvenen marka sayısı.", port_hero: "<span class='color-wipe'>Hangi sektörde</span> hikaye yaratıyoruz?", sec_turizm: "Turizm", sec_tekstil: "Tekstil", sec_saglik: "Sağlık", sec_insaat: "İnşaat", sec_eglence: "Eğlence", sec_emlak: "Emlak", sec_finans: "Finans", sec_egitim: "Eğitim", sec_lojistik: "Lojistik", sec_medya: "Medya", sec_mimari: "Mimari", sec_all: "Tüm İşlerimize Göz Atın", port_back: "Geri Dön", logo_title: "Değer Katanlar", srv_hero_1: "BİZ", srv_hero_2: "DİJİTAL", srv_hero_3: "ÇÖZÜM UZMANLARIYIZ", srv_intro_p: "Yazıhane olarak biz de çalıştığımız tüm markalarımıza aynı özveri ve samimiyetle yaklaşıyor...", srv_list_title: "HİZMETLERİMİZ", srv_back: "DİĞER HİZMETLER", srv_1_title: "360° Hizmet", srv_2_title: "Video Prodüksiyon", srv_3_title: "Sosyal Medya Yönetimi", srv_4_title: "Grafik Tasarım", srv_5_title: "Kreatif Çözümler", srv_6_title: "Dijital Pazarlama ve Reklam", car_title_1: "CESUR", car_title_2: "KIŞKIRTICI", car_dna: "BU BİZİM DNA'MIZ", car_statement: "<span class='red'>Yazıhane</span> özgün projeler üreten <span class='red'>360° reklam ajansıdır.</span>", car_desc: "Şekillenmesine yardımcı olabileceğin bir ajansa katılmaya hazırsan bizimle iletişime geç.", car_link: "Hemen CV'ni gönder! ↗", car_mid_text: "Her departmanda Yazıhane ruhunu taşıyan karakteristik izler ararız...", fu_title: "BİZİ TAKİP EDİN" },
    en: { hero_title: "WE ARE YAZIHANE", nav_home: "HOME", nav_work: "WORK", nav_about: "ABOUT", nav_services: "SERVICES", nav_careers: "CAREERS", nav_contact: "CONTACT", ticker_text: "CREATIVE REVOLUTION — 2026 — YAZIHANE", man_1: "We are Yazıhane.", man_2: "We weren't born in the ad industry;", man_3: "we grew up in the real world.", man_4: "That's why everything we create consists of hand-crafted stories.", man_link: "MORE ABOUT US ↗", team_title: "WHO WE ARE", role_founder: "Founder", role_gm: "General Manager", role_cd: "Creative Manager", role_marketing: "Marketing & Business Dev.", role_ad: "Art Director", role_hgd: "Head of Graphic Design", role_video: "Videographer", role_gd: "Graphic Designer", role_social: "Social Media", brands_title: "OUR PARTNERS", slo_meta_new: "EST. 2016", slo_1: "WE ARE HERE", slo_2: "FOR THOSE WHO", slo_3: "HAVE SOMETHING TO SAY.", slo_red: "EVERYONE HAS A STORY.", lbl_services: "OUR SERVICES", srv_1: "360° Services", srv_2: "Video Production", srv_3: "Social Media Management", srv_4: "Graphic Design", srv_5: "Creative Solutions", srv_6: "Digital Marketing & Ads", footer_contact: "REACH OUT", leg_1: "TERMS OF USE", leg_2: "PRIVACY POLICY", leg_3: "COOKIES POLICY", copy: "2026 © ALL RIGHTS RESERVED BY YAZIHANE.", ab_hero_1: "WE ARE HERE", ab_hero_2: "FOR THOSE WHO", ab_hero_3a: "HAVE", ab_hero_3b: "A WORD TO SAY.", ab_hero_red_1: "Everyone Has", ab_hero_red_2: "A Story", ab_hero_est: "SINCE 2016", ab_intro_title: "We are Yazıhane.", ab_intro_sub_1: "A global scale", ab_intro_sub_2: "Creative Agency", ab_intro_p: "As a creative team specializing in various disciplines, we love discovering stories...", ab_intro_link: "OUR SERVICES ↗", ab_hww_bg: "HOW WE<br>WORK?", ab_hww_1: "PROACTIVITY", ab_hww_2: "PASSION", ab_hww_3: "PERFORMANCE", ab_hww_link: "VIEW OUR WORK ↗", ab_team_title: "WHO WE ARE", ab_team_desc: "Brands that have trusted us.", port_hero: "<span class='color-wipe'>In which sector</span> do we create stories?", sec_turizm: "Tourism", sec_tekstil: "Textile", sec_saglik: "Healthcare", sec_insaat: "Construction", sec_eglence: "Entertainment", sec_emlak: "Real Estate", sec_finans: "Finance", sec_egitim: "Education", sec_lojistik: "Logistics", sec_medya: "Media", sec_mimari: "Architecture", sec_all: "Browse All Our Work", port_back: "Go Back", logo_title: "Value Adders", srv_hero_1: "WE ARE", srv_hero_2: "DIGITAL", srv_hero_3: "SOLUTION EXPERTS", srv_intro_p: "At Yazıhane, we approach all brands with dedication...", srv_list_title: "OUR SERVICES", srv_back: "OTHER SERVICES", srv_1_title: "360° Services", srv_2_title: "Video Production", srv_3_title: "Social Media Management", srv_4_title: "Graphic Design", srv_5_title: "Creative Solutions", srv_6_title: "Digital Marketing", car_title_1: "COURAGEOUS", car_title_2: "PROVOCATIVE", car_dna: "THAT'S OUR DNA", car_statement: "<span class='red'>Yazıhane</span> is a <span class='red'>360° ad agency</span> producing unique projects.", car_desc: "If you're ready to join us, get in touch.", car_link: "Send your CV! ↗", car_mid_text: "In every department, we look for Yazıhane spirit...", fu_title: "FOLLOW US" }
};

window.setLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('yazihane_lang', lang);
    document.documentElement.lang = lang; 

    document.querySelectorAll('.lang-btn, .lang-btn-mobile').forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.lang-btn[data-lang="${lang}"], .lang-btn-mobile[data-lang="${lang}"]`).forEach(b => b.classList.add('active'));
    
    const desktopCurrent = document.getElementById('desktop-lang-current-text');
    if(desktopCurrent) desktopCurrent.innerHTML = `${lang.toUpperCase()} <span style="font-size: 8px;">▼</span>`;
    const mobileCurrent = document.querySelector('.mobile-lang-current');
    if(mobileCurrent) mobileCurrent.innerHTML = `${lang.toUpperCase()} <span style="font-size: 8px;">▼</span>`;

    // Ana Sayfa Parallax Title Güncellemesi
    updateHeroTitle(i18n[lang].hero_title || "BİZ YAZIHANEYİZ", lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        if(i18n[lang] && i18n[lang][el.dataset.i18n]) el.innerHTML = i18n[lang][el.dataset.i18n];
    });

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.style.fontFamily = lang === 'ar' ? "'Space Grotesk', sans-serif" : "'Inter', sans-serif";
};

// --- 3. YOUTUBE HASHTAG SİLİCİ (MÜŞTERİ ADI BULUCU) ---
function cleanProjectName(rawTitle) {
    // Sadece # ile başlayanları siler (Örn: "Kempinski #tanitim" -> "Kempinski")
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
                cleanClientName: cleanProjectName(v.title) // Tertemiz Müşteri İsmi
            }));
            isVideosLoaded = true;
        }
    } catch(e) { console.error("YouTube veri çekme hatası:", e); }
    return globalVideoCache;
}

// --- 4. SAYFA ÖZEL (PAGE-SPECIFIC) FONKSİYONLAR ---

// 4.1 Ana Sayfa (Home) Zekası
const parallaxSpeeds = [0.1, 0.3, -0.1, 0.4, -0.2, 0.2, -0.3];
function updateHeroTitle(text, lang) {
    const container = document.getElementById('parallax-title');
    if(!container) return;
    container.innerHTML = '';
    let speedIndex = 0;
    const elements = lang === 'ar' ? text.split(' ') : text.split('');
    for (let el of elements) {
        if (el === ' ' && lang !== 'ar') {
            container.appendChild(document.createTextNode('\u00A0'));
        } else {
            const span = document.createElement('span');
            span.textContent = el + (lang === 'ar' ? ' ' : '');
            span.setAttribute('data-speed', parallaxSpeeds[speedIndex % parallaxSpeeds.length]);
            container.appendChild(span);
            speedIndex++;
        }
    }
}

function handleGlobalScroll() {
    const scrollY = window.scrollY;
    
    // Parallax
    document.querySelectorAll('#parallax-title span').forEach(span => {
        const speed = span.getAttribute('data-speed');
        if(scrollY < window.innerHeight) span.style.transform = `translateY(${scrollY * speed}px)`;
    });

    // Video Mask (Ana Sayfa)
    const videoMask = document.getElementById('video-mask');
    if(window.innerWidth > 1024 && videoMask) {
        const rect = document.getElementById('showreel-container').getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            let calcSize = 5 + (((window.innerHeight - rect.top) / rect.height) * 200);
            if(calcSize > 150) calcSize = 150;
            videoMask.style.clipPath = `circle(${calcSize}% at 50% 50%)`;
        }
    } else if (videoMask) {
        videoMask.style.clipPath = 'none';
    }

    // Header Blur
    const header = document.getElementById('main-header');
    if(header) {
        if (scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', handleGlobalScroll);

function setupHomeCarousel() {
    const teamCarousel = document.getElementById('team-carousel');
    if (!teamCarousel) return;
    
    const updateTeamCarousel = () => {
        const containerCenter = teamCarousel.getBoundingClientRect().left + (teamCarousel.offsetWidth / 2);
        const allCards = teamCarousel.querySelectorAll('.team-card');
        allCards.forEach(card => {
            const cardCenter = card.getBoundingClientRect().left + (card.offsetWidth / 2);
            card.classList.toggle('active', Math.abs(containerCenter - cardCenter) < 160);
        });
    };
    teamCarousel.addEventListener('scroll', updateTeamCarousel);
    setTimeout(updateTeamCarousel, 100);
}

// 4.2 Kariyer Sayfası (Careers) Galerisi
function setupCareersGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if(!galleryContainer) return;
    
    galleryContainer.innerHTML = ''; // Temizle
    const weAreImages = []; 
    for(let i=1; i<=15; i++) { weAreImages.push(`https://picsum.photos/800/1000?random=${i}`); } 

    weAreImages.forEach((src, index) => {
        const box = document.createElement('div');
        box.className = 'gallery-img-box';
        box.innerHTML = `<img src="https://picsum.photos/400/500?random=${index + 1}" alt="Ekip ${index + 1}">`; 
        box.addEventListener('click', () => {
            const lbImg = document.getElementById('lb-img');
            const lightbox = document.getElementById('lightbox');
            if(lbImg && lightbox) {
                lbImg.src = weAreImages[index]; 
                lightbox.classList.add('active');
            }
        });
        galleryContainer.appendChild(box);
    });

    // Lightbox Kapatma Mantığı
    const lightbox = document.getElementById('lightbox');
    const lbClose = document.getElementById('lb-close');
    if(lbClose && lightbox) {
        lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrapper')) lightbox.classList.remove('active');
        });
    }
}

// 4.3 Genel Scroll Animasyon Başlatıcı
function initScrollAnimations() {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('turn-red')) setTimeout(() => entry.target.classList.add('active'), 600);
                if (entry.target.classList.contains('red-marker')) entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 }); 
    document.querySelectorAll('.reveal-up, .reveal-fade, .turn-red, .red-marker').forEach(el => scrollObserver.observe(el));
}

// --- 5. HİZMETLER SAYFASI FONKSİYONLARI ---
window.openService = function(serviceId) {
    const listView = document.getElementById('services-list-view');
    const detailView = document.getElementById('service-detail-view');
    if(!listView || !detailView) return;
    
    listView.style.display = 'none';
    detailView.style.display = 'block';
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

// --- 6. SPA ROUTER (SAYFA GEÇİŞ MOTORU) ---
const appRoot = document.getElementById('app-root');

document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if(link) {
        e.preventDefault();
        loadPage(link.getAttribute('data-link'));
        const mobileMenu = document.getElementById('mobile-menu-overlay');
        if(mobileMenu) mobileMenu.classList.remove('active');
    }
});

async function loadPage(path) {
    if(!appRoot) return;
    appRoot.classList.add('page-loading'); 
    
    try {
        const response = await fetch(`/pages${path}.html`);
        if (!response.ok) throw new Error('Sayfa bulunamadı');
        const html = await response.text();
        
        setTimeout(() => {
            appRoot.innerHTML = html;
            window.scrollTo(0, 0); 
            appRoot.classList.remove('page-loading'); 
            
            // Sayfa yüklendi, gerekli zekayı çalıştır!
            window.setLanguage(currentLang);
            initScrollAnimations();
            
            if(path === '/home') {
                updateHeroTitle(i18n[currentLang].hero_title || "BİZ YAZIHANEYİZ", currentLang);
                setupHomeCarousel();
            }
            if(path === '/careers') {
                setupCareersGallery();
            }
            // (İleride Portfolio filtrelerini buraya ekleyeceğiz)
            
        }, 300); 
        
    } catch (error) {
        console.error("Router Hatası:", error);
        appRoot.innerHTML = `<h2 style="text-align:center; padding:150px 20px; font-family:'Big Shoulders Display'; font-size:3rem;">SAYFA YÜKLENEMEDİ.</h2>`;
        appRoot.classList.remove('page-loading');
    }
}

// --- 7. SİTE İLK AÇILIŞI ---
window.addEventListener('DOMContentLoaded', () => {
    updateSmartClock();
    window.setLanguage(currentLang);
    loadPage('/home');   
    fetchAllVideos();    
    
    // Dropdown ve Hamburger Menü Kontrolleri
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('lang-btn') || e.target.classList.contains('lang-btn-mobile')) {
            window.setLanguage(e.target.dataset.lang);
        }
        
        const dtTrigger = e.target.closest('#desktop-lang-trigger');
        const mbTrigger = e.target.closest('#mobile-lang-trigger');
        if(dtTrigger) dtTrigger.classList.toggle('active');
        if(mbTrigger) mbTrigger.classList.toggle('active');
        if(!dtTrigger && !mbTrigger) {
            document.getElementById('desktop-lang-trigger')?.classList.remove('active');
            document.getElementById('mobile-lang-trigger')?.classList.remove('active');
        }

        const hamburgerBtn = e.target.closest('#mobile-hamburger-btn');
        const closeBtn = e.target.closest('#mobile-close-btn');
        const overlay = document.getElementById('mobile-menu-overlay');
        if(hamburgerBtn && overlay) overlay.classList.add('active');
        if(closeBtn && overlay) overlay.classList.remove('active');
    });
});
