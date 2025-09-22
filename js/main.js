document.addEventListener('DOMContentLoaded', function () {
    // Load Navbar
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        fetch('navbar.html') // Adjust path if navbar.html is elsewhere
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok for navbar.html: ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                updateActiveNavLinks(); // Call function to set active link
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Error loading navigation.</p>';
            });
    } else {
        console.warn('Navbar placeholder not found on this page.');
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok for footer.html: ' + response.statusText + ' (Status: ' + response.status + ')');
                }
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                // After footer HTML is injected, update the year
                const yearSpanInFooter = document.getElementById('currentYearInFooter');
                if (yearSpanInFooter) {
                    yearSpanInFooter.textContent = new Date().getFullYear();
                }
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                if (footerPlaceholder) {
                    footerPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Error loading footer.</p>';
                }
            });
    }
});

function updateActiveNavLinks() {
    const currentPageUrl = window.location.href; // Full URL
    const navLinks = document.querySelectorAll('#navbar-placeholder .navbar-nav .nav-link, #navbar-placeholder .navbar-nav .dropdown-item');

    navLinks.forEach(link => {
        link.classList.remove('active'); // Remove active from all links first

        // Make href absolute for comparison
        let linkHref = link.href;

        if (currentPageUrl === linkHref) {
            link.classList.add('active');

            // If it's a dropdown item, also activate its parent toggle
            if (link.classList.contains('dropdown-item')) {
                const parentDropdownToggle = link.closest('.nav-item.dropdown')?.querySelector('.nav-link.dropdown-toggle');
                if (parentDropdownToggle) {
                    parentDropdownToggle.classList.add('active');
                }
            }
        }
    });

    // Special case for home page if it's just index.html and link is "index.html" or "/"
    // This logic might need adjustment based on your exact server setup and how index.html is served
    if (window.location.pathname === '/' || window.location.pathname.endsWith('home.html')) {
        const homeLink = document.querySelector('#navbar-placeholder .navbar-nav .nav-link[href="home.html"]');
        if (homeLink) {
            // Ensure only one "HOME" like primary link is active
            document.querySelectorAll('#navbar-placeholder .navbar-nav > .nav-item > .nav-link.active').forEach(l => l.classList.remove('active'));
            homeLink.classList.add('active');
        }
    }
}