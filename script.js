// Intersection Observer simples e leve
const projetos = document.querySelectorAll('.projeto-flip');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // observer.unobserve(entry.target); // ← descomente se quiser animar só 1x
        }
    });
}, {
    threshold: 0.15,          // começa quando 15% do card aparece
    rootMargin: "0px 0px -10% 0px"
});

projetos.forEach((projeto, index) => {
    projeto.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(projeto);
});
