// Scroll-reveal animation
document.addEventListener('DOMContentLoaded', function () {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const revealContent = document.querySelector('.scroll-reveal-content');
    if (revealContent) {
        observer.observe(revealContent);
    }
});
