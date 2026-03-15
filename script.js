// =============================================
// Tema (dark/light) + persistência no localStorage
// =============================================
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = themeToggleBtn?.querySelector("i"); // safe access

function applyTheme(theme) {
    const isLight = theme === "light";
    
    document.body.classList.toggle("light-mode", isLight);
    
    if (themeIcon) {
        themeIcon.classList.toggle("fa-sun", isLight);
        themeIcon.classList.toggle("fa-moon", !isLight);
    }
    
    localStorage.setItem("theme", theme);
}

// Inicializa tema ao carregar página
function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    
    // Se não houver preferência salva, usa preferência do sistema
    if (!savedTheme) {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark ? "dark" : "light");
        return;
    }
    
    applyTheme(savedTheme);
}

// Evento de clique no botão de tema
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        const currentIsLight = document.body.classList.contains("light-mode");
        const newTheme = currentIsLight ? "dark" : "light";
        applyTheme(newTheme);
    });
}

// Executa inicialização do tema
initTheme();

// Opcional: escuta mudança de preferência do sistema (muito útil)
window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
        // Só aplica automaticamente se o usuário NÃO salvou preferência manual
        if (!localStorage.getItem("theme")) {
            applyTheme(e.matches ? "dark" : "light");
        }
    });


// =============================================
// Menu Hamburger
// =============================================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        // Opcional: acessibilidade — aria-expanded
        const isExpanded = navMenu.classList.contains("active");
        hamburger.setAttribute("aria-expanded", isExpanded);
    });

    // Fecha ao clicar em link
    document.querySelectorAll(".menu a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });

    // Boa prática: fecha ao clicar fora (opcional, mas melhora UX)
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });
}


// =============================================
// Animação de entrada dos projetos (Intersection Observer)
// =============================================
const projetos = document.querySelectorAll(".projeto-flip");

if (projetos.length > 0) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    // observer.unobserve(entry.target); // descomente se quer animar apenas uma vez
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -10% 0px",
        }
    );

    projetos.forEach((projeto, index) => {
        // Delay escalonado para efeito cascata bonito
        projeto.style.transitionDelay = `${index * 0.12}s`;
        observer.observe(projeto);
    });
}