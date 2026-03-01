document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('pluginModal');

    function setupBtn(element, url) {
        if (!element) return;
        if (!url || url === '#') {
            element.style.display = 'none';
        } else {
            element.style.display = 'flex';
            element.href = url;
        }
    }

    if (modal) {
        const modalTitle = document.getElementById('modalTitle');
        const btnSpigot = document.getElementById('btn-spigot');
        const btnModrinth = document.getElementById('btn-modrinth');
        const btnBuiltByBit = document.getElementById('btn-builtbybit');
        const btnPolymart = document.getElementById('btn-polymart');
        const closeBtn = document.querySelector('.close-modal');

        document.querySelectorAll('.open-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const name = btn.getAttribute('data-name') || 'Plugin';
                const spigot = btn.getAttribute('data-spigot');
                const modrinth = btn.getAttribute('data-modrinth');
                const builtbybit = btn.getAttribute('data-builtbybit');
                const polymart = btn.getAttribute('data-polymart');

                if (modalTitle) modalTitle.textContent = name;

                setupBtn(btnSpigot, spigot);
                setupBtn(btnModrinth, modrinth);
                setupBtn(btnBuiltByBit, builtbybit);
                setupBtn(btnPolymart, polymart);

                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('show'), 10);
            });
        });

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => (modal.style.display = 'none'), 300);
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
        });
    }

    const langOptions = document.querySelectorAll('.lang-option');
    if (langOptions.length) {
        let currentLang = 'en';

        function setLanguage(lang) {
            currentLang = lang;
            langOptions.forEach(opt => {
                opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
            });
            document.querySelectorAll('[data-' + lang + ']').forEach(el => {
                el.textContent = el.getAttribute('data-' + lang);
            });
        }

        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                if (lang) setLanguage(lang);
            });
        });

        setLanguage(currentLang);
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && systemDark);

        function updateTheme() {
            if (isDark) {
                document.body.classList.remove('light-mode');
                if (icon) icon.className = 'fas fa-sun';
            } else {
                document.body.classList.add('light-mode');
                if (icon) icon.className = 'fas fa-moon';
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
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .scroll-animate').forEach(el => {
        observer.observe(el);
    });

    const progressBar = document.getElementById('readingProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = Math.min(progress, 100) + '%';
        }, { passive: true });
    }

    const docsLinks = document.querySelectorAll('.wiki-sidebar .docs-link');
    if (docsLinks.length) {
        const sections = [];
        docsLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.getElementById(href.substring(1));
                if (target) {
                    sections.push({ link, target });
                }
            }
        });

        if (sections.length) {
            let ticking = false;

            function updateActiveLink() {
                const scrollPos = window.scrollY + 120;
                let activeSection = sections[0];

                for (const section of sections) {
                    if (section.target.offsetTop <= scrollPos) {
                        activeSection = section;
                    }
                }

                docsLinks.forEach(l => l.classList.remove('active'));
                if (activeSection) {
                    activeSection.link.classList.add('active');
                }
                ticking = false;
            }

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateActiveLink);
                    ticking = true;
                }
            }, { passive: true });

            updateActiveLink();
        }
    }

    document.querySelectorAll('.docs-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.getElementById(href.substring(1));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    const faviconImg = new Image();
    faviconImg.crossOrigin = "Anonymous";
    faviconImg.src = "https://github.com/marwannull.png";
    faviconImg.onload = () => {
        const favCanvas = document.createElement('canvas');
        favCanvas.width = 64;
        favCanvas.height = 64;
        const favCtx = favCanvas.getContext('2d');
        if (!favCtx) return;

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
