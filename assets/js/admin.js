/**
 * Email Verifier - Clean & Simple Admin JS Enhancements
 * Developed by Host Nibo (https://hostnibo.com)
 */

document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.ev-admin-wrapper') || document.body;

    // 1. Toast Notification Helper
    function showToast(msg) {
        const existing = document.querySelector('.ev-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'ev-toast';
        toast.innerHTML = `<i class="fa fa-check-circle" style="color: #4ade80;"></i> <span>${msg}</span>`;
        document.body.appendChild(toast);

        setTimeout(function () {
            toast.style.transition = 'opacity 0.3s ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // 2. Simple & Clean Header Bar
    if (!wrapper.querySelector('.ev-simple-header')) {
        const nav = wrapper.querySelector('.nav-tabs, ul.nav-pills, .navbar-nav');
        if (nav) {
            // Remove legacy duplicate title element before nav if exists
            let prev = nav.previousElementSibling;
            while (prev) {
                const txt = prev.textContent.trim();
                if (txt === 'Email Verifier' || prev.tagName === 'H1' || prev.tagName === 'H2' || prev.classList.contains('page-header')) {
                    prev.style.display = 'none';
                }
                prev = prev.previousElementSibling;
            }

            const header = document.createElement('div');
            header.className = 'ev-simple-header';
            header.innerHTML = `
                <div class="ev-simple-header-left">
                    <img src="../modules/addons/email_verifier/logo.png" alt="Email Verifier" class="ev-simple-logo" onerror="this.style.display='none'">
                    <div class="ev-simple-title">
                        <h2>Email Verifier</h2>
                        <p>Email verification and fraud protection module for WHMCS</p>
                    </div>
                </div>
                <div class="ev-simple-header-right">
                    <a href="addonmodules.php?module=email_verifier&action=license" class="btn btn-default btn-sm">
                        <i class="fa fa-shield"></i> License
                    </a>
                    <a href="https://hostnibo.com/contact" target="_blank" class="btn btn-default btn-sm">
                        <i class="fa fa-life-ring"></i> Support
                    </a>
                </div>
            `;
            nav.parentNode.insertBefore(header, nav);
        }
    }

    // Hide any orphan legacy title element inside wrapper
    wrapper.querySelectorAll('h1, h2, h3, h4, div.page-header, div.header').forEach(function(el) {
        if (!el.closest('.ev-simple-header') && !el.closest('.panel') && !el.closest('.card') && !el.closest('.alert') && !el.closest('.nav-tabs')) {
            if (el.textContent.trim() === 'Email Verifier') {
                el.style.display = 'none';
            }
        }
    });

    // 3. Tab Icons
    const navLinks = wrapper.querySelectorAll('.nav-tabs a, ul.nav-pills a, .navbar-nav a');
    navLinks.forEach(function (link) {
        const text = link.textContent.trim().toLowerCase();
        let iconClass = 'fa-folder';

        if (text.includes('verified clients')) {
            iconClass = 'fa-check-circle';
        } else if (text.includes('unverified clients')) {
            iconClass = 'fa-user-times';
        } else if (text.includes('banned')) {
            iconClass = 'fa-ban';
        } else if (text.includes('settings')) {
            iconClass = 'fa-cog';
        } else if (text.includes('license')) {
            iconClass = 'fa-shield';
        }

        if (!link.querySelector('i.fa') && iconClass) {
            const icon = document.createElement('i');
            icon.className = 'fa ' + iconClass;
            icon.style.marginRight = '5px';
            link.prepend(icon);
        }
    });

    // 4. Clean Toggle Switches for Settings Checkboxes
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

    // 5. Clean Copy Button for Emails & IPs
    const tables = wrapper.querySelectorAll('.table');
    tables.forEach(function (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(function (row) {
            row.querySelectorAll('td').forEach(function (cell) {
                const text = cell.textContent.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

                if ((emailRegex.test(text) || ipRegex.test(text)) && !cell.querySelector('.ev-copy-btn')) {
                    const copyBtn = document.createElement('button');
                    copyBtn.type = 'button';
                    copyBtn.className = 'ev-copy-btn';
                    copyBtn.title = 'Copy';
                    copyBtn.innerHTML = '<i class="fa fa-clone"></i>';

                    copyBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (navigator.clipboard) {
                            navigator.clipboard.writeText(text).then(function () {
                                copyBtn.innerHTML = '<i class="fa fa-check text-success"></i>';
                                showToast(`Copied: ${text}`);
                                setTimeout(() => copyBtn.innerHTML = '<i class="fa fa-clone"></i>', 1500);
                            });
                        }
                    });

                    cell.appendChild(copyBtn);
                }
            });
        });

        // 6. Simple Quick Search Box above tables
        if (rows.length > 2 && !table.closest('.ev-admin-wrapper')?.querySelector('.ev-search-container')) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'ev-search-container';
            searchContainer.innerHTML = `
                <input type="text" class="form-control ev-search-input" placeholder="Search table...">
            `;

            const input = searchContainer.querySelector('input');
            input.addEventListener('input', function () {
                const q = this.value.toLowerCase().trim();
                rows.forEach(function (r) {
                    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
                });
            });

            table.closest('.table-responsive')?.parentNode.insertBefore(searchContainer, table.closest('.table-responsive'));
        }
    });

    // 7. Auto-dismiss Success Alerts
    const successAlerts = wrapper.querySelectorAll('.alert-success');
    successAlerts.forEach(function (alert) {
        setTimeout(function () {
            alert.style.transition = 'opacity 0.4s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.style.display = 'none', 400);
        }, 5000);
    });
});
