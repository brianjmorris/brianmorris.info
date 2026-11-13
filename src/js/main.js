(() => {
    const initNavigation = () => {
        const content = document.getElementById('content');
        const exitLink = document.getElementById('stars-exit');
        const titleLink = document.getElementById('page-title');
        const starsLink = document.getElementById('stars-start');
        let returnHash = '#title';
        let starsVisible = false;

        const updateView = () => {
            const showStars = window.location.hash.toLowerCase() === '#stars';
            if (!showStars) {
                returnHash = window.location.hash || '#title';
            }

            document.body.classList.toggle('stars-only', showStars);
            content.inert = showStars;
            exitLink.hidden = !showStars;
            exitLink.setAttribute('href', returnHash);

            if (showStars && !starsVisible) {
                exitLink.focus({ preventScroll: true });
            } else if (!showStars && starsVisible) {
                const returnLink = returnHash === '#stargazing' ? starsLink : titleLink;
                returnLink.focus({ preventScroll: true });
            }
            starsVisible = showStars;
        };

        starsLink.addEventListener('click', () => { returnHash = '#stargazing'; });
        window.addEventListener('hashchange', updateView);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && starsVisible) {
                window.location.hash = returnHash;
            }
        });
        updateView();
    };

    document.addEventListener('DOMContentLoaded', initNavigation, { once: true });
})();
