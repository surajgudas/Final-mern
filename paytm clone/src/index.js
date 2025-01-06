document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Handle navigation
    const contentDiv = document.getElementById('content');
    
    async function loadContent(page) {
        try {
            const response = await fetch(`/api/content/${page}`);
            const data = await response.json();
            
            contentDiv.innerHTML = `
                <h1 class="text-3xl font-bold mb-4">${data.title}</h1>
                <p class="text-gray-700">${data.content}</p>
            `;

            // Update active states
            document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `/${page}` || 
                    (page === 'home' && link.getAttribute('href') === '/')) {
                    link.classList.add('active');
                }
            });
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    // Handle navigation clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="/"]')) {
            e.preventDefault();
            const page = e.target.getAttribute('href').slice(1) || 'home';
            loadContent(page);
            history.pushState(null, '', e.target.href);
            mobileMenu.classList.add('hidden');
        }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const page = window.location.pathname.slice(1) || 'home';
        loadContent(page);
    });

    // Load initial content
    const initialPage = window.location.pathname.slice(1) || 'home';
    loadContent(initialPage);
}); 