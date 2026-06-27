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
    const setMenuOpen = (isOpen) => {
        navMenu.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen);
        hamburger.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
        document.body.classList.toggle("menu-open", isOpen);
    };

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        setMenuOpen(!navMenu.classList.contains("active"));
    });

    // Fecha ao clicar em link
    document.querySelectorAll(".menu a").forEach(link => {
        link.addEventListener("click", () => {
            setMenuOpen(false);
        });
    });

    // Boa prática: fecha ao clicar fora (opcional, mas melhora UX)
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            setMenuOpen(false);
        }
    });
}


// Animação de entrada dos projetos
const projetos = document.querySelectorAll(".projeto-flip");

function animarEntradaProjetos(lista) {
    lista.forEach((projeto, index) => {
        projeto.style.opacity = "0";
        projeto.style.transform = "translateY(30px)";
        projeto.style.transition = "all 0.5s ease";
        projeto.style.transitionDelay = `${index * 0.08}s`;
        
        setTimeout(() => {
            projeto.style.opacity = "1";
            projeto.style.transform = "translateY(0)";
        }, 50);
    });
}

animarEntradaProjetos(projetos);

// Filtro por categoria
const filtroBotoes = document.querySelectorAll(".filtro-btn");

filtroBotoes.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filtroBotoes.forEach(b => b.classList.remove("ativo"));
        btn.classList.add("ativo");

        const todosProjetos = document.querySelectorAll(".projeto-flip");
        let visiveis = [];

        todosProjetos.forEach(projeto => {
            const categoria = projeto.dataset.category;
            if (filter === "all" || categoria === filter) {
                projeto.style.display = "";
                projeto.style.opacity = "0";
                projeto.style.transform = "translateY(20px)";
                visiveis.push(projeto);
            } else {
                projeto.style.display = "none";
                projeto.style.opacity = "0";
                projeto.style.transform = "translateY(20px)";
            }
        });

        animarEntradaProjetos(visiveis);
    });
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
