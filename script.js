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


// Stack de projetos empilhados
let stackIndex = 0;
const todosProjetos = document.querySelectorAll(".projeto-flip");
const stackCounter = document.querySelector(".stack-counter");
const stackPrev = document.querySelector(".stack-prev");
const stackNext = document.querySelector(".stack-next");
const projetoWrapper = document.getElementById("projeto-wrapper");

function getFilteredProjetos() {
    const ativo = document.querySelector(".filtro-btn.ativo");
    const filter = ativo ? ativo.dataset.filter : "all";
    return Array.from(todosProjetos).filter(p =>
        filter === "all" || p.dataset.category === filter
    );
}

function renderStack() {
    const filtered = getFilteredProjetos();
    const total = filtered.length;

    if (stackIndex >= total) stackIndex = total - 1;
    if (stackIndex < 0) stackIndex = 0;

    // Hide all & remove order
    todosProjetos.forEach(p => {
        p.className = p.className
            .replace(/\bstack-\w+/g, '')
            .trim();
        p.style.display = "none";
    });

    if (total === 0) {
        stackCounter.textContent = "0 / 0";
        return;
    }

    // Show stack: current (0), behind (1), behind-2 (2)
    filtered.forEach((p, i) => {
        p.style.display = "";
        const pos = i - stackIndex;
        if (pos === 0) {
            p.classList.add("stack-visible", "stack-0");
        } else if (pos === 1) {
            p.classList.add("stack-visible", "stack-1");
        } else if (pos === 2) {
            p.classList.add("stack-visible", "stack-2");
        } else {
            p.classList.add("stack-hidden");
        }
    });

    stackCounter.textContent = `${stackIndex + 1} / ${total}`;
    stackCounter.style.transform = "scale(1.2)";
    setTimeout(() => { stackCounter.style.transform = "scale(1)"; }, 200);

    // Desabilita botoes nos limites
    [stackPrev, sidePrev].forEach(btn => {
        if (btn) { btn.disabled = stackIndex === 0; }
    });
    [stackNext, sideNext].forEach(btn => {
        if (btn) { btn.disabled = stackIndex >= total - 1; }
    });

    // Altura fixa: não varia por projeto
    projetoWrapper.style.minHeight = "";
}

function goNext() {
    const total = getFilteredProjetos().length;
    if (stackIndex < total - 1) {
        // Fecha details antes de navegar
        const current = getFilteredProjetos()[stackIndex];
        const details = current?.querySelector(".projeto-verso");
        if (details) details.open = false;
        stackIndex++;
        renderStack();
    }
}

function goPrev() {
    if (stackIndex > 0) {
        const current = getFilteredProjetos()[stackIndex];
        const details = current?.querySelector(".projeto-verso");
        if (details) details.open = false;
        stackIndex--;
        renderStack();
    }
}

function goToProject(index) {
    const filtered = getFilteredProjetos();
    if (index >= 0 && index < filtered.length) {
        const current = filtered[stackIndex];
        const details = current?.querySelector(".projeto-verso");
        if (details) details.open = false;
        stackIndex = index;
        renderStack();
    }
}

// Eventos navegacao
if (stackNext) stackNext.addEventListener("click", (e) => { e.stopPropagation(); goNext(); });
if (stackPrev) stackPrev.addEventListener("click", (e) => { e.stopPropagation(); goPrev(); });

// Click no wrapper (area vazia) avanca
if (projetoWrapper) {
    projetoWrapper.addEventListener("click", (e) => {
        if (e.target.closest("details") || e.target.closest("a") || e.target.closest("button") || e.target.closest(".side-arrow")) return;
        e.stopPropagation();
        goNext();
    });
}

// Setas laterais
const sidePrev = document.querySelector(".side-arrow-prev");
const sideNext = document.querySelector(".side-arrow-next");

if (sidePrev) sidePrev.addEventListener("click", (e) => { e.stopPropagation(); goPrev(); });
if (sideNext) sideNext.addEventListener("click", (e) => { e.stopPropagation(); goNext(); });

// Teclado
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
});

// Filtro por categoria
const filtroBotoes = document.querySelectorAll(".filtro-btn");

filtroBotoes.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filtroBotoes.forEach(b => b.classList.remove("ativo"));
        btn.classList.add("ativo");

        stackIndex = 0;
        renderStack();
    });
});

// Inicializa
renderStack();

// Expand Top: move midias para fora do details e controla layout
document.querySelectorAll('.projeto-flip').forEach(projeto => {
    const frente = projeto.querySelector('.projeto-frente');
    const info = frente.querySelector('.projeto-info');
    const details = info.querySelector('.projeto-verso');

    const expandTop = document.createElement('div');
    expandTop.className = 'expand-top';

    ['foto-HamburgueriaZ', 'foto-PyFinancas'].forEach(cls => {
        const wrapper = details.querySelector('.' + cls);
        if (wrapper && details.contains(wrapper)) {
            expandTop.appendChild(wrapper);
        }
    });

    const imgs = details.querySelectorAll('.foto-expandida');
    imgs.forEach(img => {
        if (details.contains(img)) {
            expandTop.appendChild(img);
        }
    });

    const videos = details.querySelectorAll('.video-demo');
    videos.forEach(v => expandTop.appendChild(v));

    if (expandTop.children.length > 0) {
        frente.insertBefore(expandTop, info);
    }

    const toggleExpandido = function() {
        projeto.classList.toggle('expandido', details.open);
        const summary = details.querySelector('summary');
        if (summary) {
            summary.textContent = details.open ? 'Mostrar menos ▲' : 'Saiba mais....';
        }
    };

    details.addEventListener('toggle', toggleExpandido);
    toggleExpandido();
});
