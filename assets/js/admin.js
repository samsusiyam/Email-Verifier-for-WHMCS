/**
 * Email Verifier - Modern Admin JavaScript Enhancements
 * Developed by Host Nibo
 * Website: https://hostnibo.com
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Ensure root wrapper has the theme class
    const wrapper = document.querySelector('.ev-admin-wrapper') || document.body;

    // 2. Add icon decorations to navigation tabs
    const navLinks = wrapper.querySelectorAll('.nav-tabs a, ul.nav-pills a, .navbar-nav a');
    navLinks.forEach(function (link) {
        const text = link.textContent.trim().toLowerCase();
        let iconClass = 'fa-folder';

        if (text.includes('verified clients')) {
            iconClass = 'fa-check-circle text-success';
        } else if (text.includes('unverified clients')) {
            iconClass = 'fa-user-times text-warning';
        } else if (text.includes('banned')) {
            iconClass = 'fa-ban text-danger';
        } else if (text.includes('settings')) {
            iconClass = 'fa-cog text-primary';
        } else if (text.includes('license')) {
            iconClass = 'fa-shield text-info';
        }

        if (!link.querySelector('i.fa') && iconClass) {
            const icon = document.createElement('i');
            icon.className = 'fa ' + iconClass;
            icon.style.marginRight = '6px';
            link.prepend(icon);
        }
    });

    // 3. Convert standard checkboxes in form-groups to modern toggle switches
    const checkboxes = wrapper.querySelectorAll('.form-group input[type="checkbox"]');
    checkboxes.forEach(function (cb) {
        if (cb.dataset.evEnhanced) return;
        cb.dataset.evEnhanced = 'true';

        const parent = cb.closest('label') || cb.parentElement;
        if (!parent) return;

        const toggleWrapper = document.createElement('label');
        toggleWrapper.className = 'ev-toggle-switch';

        const slider = document.createElement('span');
        slider.className = 'ev-toggle-slider';

        cb.parentNode.insertBefore(toggleWrapper, cb);
        toggleWrapper.appendChild(cb);
        toggleWrapper.appendChild(slider);
    });

    // 4. Add copy button to email addresses & IPs in tables
    const tableCells = wrapper.querySelectorAll('.table td');
    tableCells.forEach(function (cell) {
        const text = cell.textContent.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

        if ((emailRegex.test(text) || ipRegex.test(text)) && !cell.querySelector('.ev-copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'ev-copy-btn';
            copyBtn.title = 'Copy to clipboard';
            copyBtn.innerHTML = '<i class="fa fa-clone"></i>';

            copyBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(function () {
                        copyBtn.innerHTML = '<i class="fa fa-check text-success"></i>';
                        setTimeout(function () {
                            copyBtn.innerHTML = '<i class="fa fa-clone"></i>';
                        }, 1800);
                    });
                }
            });

            cell.appendChild(copyBtn);
        }
    });

    // 5. Add live quick filter search box above data tables if not present
    const table = wrapper.querySelector('.table');
    if (table && !wrapper.querySelector('.ev-quick-search-box') && table.querySelectorAll('tbody tr').length > 3) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'ev-quick-search-box';
        searchContainer.style.cssText = 'margin-bottom: 14px; display: flex; justify-content: flex-end;';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control';
        searchInput.placeholder = '🔍 Quick filter table rows...';
        searchInput.style.cssText = 'max-width: 260px; font-size: 13px; padding: 7px 12px; border-radius: 8px;';

        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(function (row) {
                const rowText = row.textContent.toLowerCase();
                row.style.display = rowText.includes(query) ? '' : 'none';
            });
        });

        searchContainer.appendChild(searchInput);
        table.closest('.table-responsive')?.parentNode.insertBefore(searchContainer, table.closest('.table-responsive'));
    }

    // 6. Auto-fade success alerts after 6 seconds
    const successAlerts = wrapper.querySelectorAll('.alert-success');
    successAlerts.forEach(function (alert) {
        setTimeout(function () {
            alert.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-6px)';
            setTimeout(function () {
                alert.style.display = 'none';
            }, 600);
        }, 5000);
    });
});
