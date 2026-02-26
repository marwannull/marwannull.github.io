document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('pluginModal');
    const modalTitle = document.getElementById('modalTitle');
    const btnSpigot = document.getElementById('btn-spigot');
    const btnModrinth = document.getElementById('btn-modrinth');
    const btnBuiltByBit = document.getElementById('btn-builtbybit');
    const btnPolymart = document.getElementById('btn-polymart');
    const closeBtn = document.querySelector('.close-modal');

    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.getAttribute('data-name');
            const spigot = btn.getAttribute('data-spigot');
            const modrinth = btn.getAttribute('data-modrinth');
            const builtbybit = btn.getAttribute('data-builtbybit');
            const polymart = btn.getAttribute('data-polymart');

            modalTitle.textContent = name;
            
            setupBtn(btnSpigot, spigot);
            setupBtn(btnModrinth, modrinth);
            setupBtn(btnBuiltByBit, builtbybit);
            setupBtn(btnPolymart, polymart);

            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        });
    });

    function setupBtn(element, url) {
        if (!url || url === '#') {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
            element.href = url;
        }
    }

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    });

    const langOptions = document.querySelectorAll('.lang-option');
    let currentLang = 'en';

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    function setLanguage(lang) {
        currentLang = lang;
        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });

        document.querySelectorAll('[data-' + lang + ']').forEach(el => {
            el.textContent = el.getAttribute('data-' + lang);
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && systemDark);
    
    function updateTheme() {
        if (isDark) {
            document.body.classList.remove('light-mode');
            icon.className = 'fas fa-sun'; 
        } else {
            document.body.classList.add('light-mode');
            icon.className = 'fas fa-moon'; 
        }
    }

    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateTheme();
    });

    if (localStorage.getItem('theme')) {
        isDark = localStorage.getItem('theme') === 'dark';
    } else {
        isDark = systemDark;
    }
    updateTheme();


    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .scroll-animate').forEach(el => {
        observer.observe(el);
    });

    const faviconImg = new Image();
    faviconImg.crossOrigin = "Anonymous";
    faviconImg.src = "https://github.com/marwannull.png";
    faviconImg.onload = () => {
        const favCanvas = document.createElement('canvas');
        favCanvas.width = 64;
        favCanvas.height = 64;
        const favCtx = favCanvas.getContext('2d');
        favCtx.beginPath();
        favCtx.arc(32, 32, 32, 0, 2 * Math.PI);
        favCtx.closePath();
        favCtx.clip();
        favCtx.drawImage(faviconImg, 0, 0, 64, 64);
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = favCanvas.toDataURL();
        document.getElementsByTagName('head')[0].appendChild(link);
    };
});
