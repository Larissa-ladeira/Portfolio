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


// Animação de entrada dos projetos
const projetos = document.querySelectorAll(".projeto-flip");

projetos.forEach((projeto, index) => {
    projeto.style.opacity = "0";
    projeto.style.transform = "translateY(30px)";
    projeto.style.transition = "all 0.6s ease";
    projeto.style.transitionDelay = `${index * 0.1}s`;
    
    setTimeout(() => {
        projeto.style.opacity = "1";
        projeto.style.transform = "translateY(0)";
    }, 100);
});

// 控制项目图片显示/隐藏
document.querySelectorAll('.projeto-verso').forEach(details => {
    const toggleFoto = function() {
        const projetoInfo = details.parentElement;
        const projetoFrente = projetoInfo.parentElement;
        const foto = projetoFrente.querySelector('.foto');
        if (foto) {
            foto.style.display = details.open ? 'none' : 'block';
        }
        
        const summary = details.querySelector('summary');
        if (summary) {
            summary.textContent = details.open ? 'Mostrar menos ▲' : 'Saiba mais....';
        }
    };
    
    details.addEventListener('toggle', toggleFoto);
    
    // Verifica ao carregar a página
    toggleFoto();
});