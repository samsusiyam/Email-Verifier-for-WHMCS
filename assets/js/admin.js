/**
 * Email Verifier - Ultra-Modern Admin JavaScript Enhancements
 * Developed by Host Nibo
 * Website: https://hostnibo.com
 */

document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.ev-admin-wrapper') || document.body;

    // 1. Toast Notification Helper
    function showToast(msg, icon = 'fa-check-circle') {
        const existing = document.querySelector('.ev-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'ev-toast';
        toast.innerHTML = `<i class="fa ${icon}" style="color: #10b981; font-size: 16px;"></i> <span>${msg}</span>`;
        document.body.appendChild(toast);

        setTimeout(function () {
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // 2. Inject Brand Hero Header if not already present
    if (!wrapper.querySelector('.ev-hero-header')) {
        const nav = wrapper.querySelector('.nav-tabs, ul.nav-pills, .navbar-nav');
        if (nav) {
            const hero = document.createElement('div');
            hero.className = 'ev-hero-header';
            hero.innerHTML = `
                <div class="ev-hero-left">
                    <img src="../modules/addons/email_verifier/logo.png" alt="Email Verifier" class="ev-hero-logo" onerror="this.style.display='none'">
                    <div class="ev-hero-info">
                        <h1>
                            Email Verifier
                            <span class="ev-badge-pill ev-badge-primary"><i class="fa fa-code-fork"></i> v1.1.0</span>
                            <span class="ev-badge-pill ev-badge-elms"><i class="fa fa-shield"></i> Host Nibo ELMS</span>
                        </h1>
                        <p>Validating client email addresses & securing communication for your WHMCS.</p>
                    </div>
                </div>
                <div class="ev-hero-actions">
                    <a href="addonmodules.php?module=email_verifier&action=license" class="btn btn-default btn-sm">
                        <i class="fa fa-key text-primary"></i> License Info
                    </a>
                    <a href="https://hostnibo.com/contact" target="_blank" class="btn btn-default btn-sm">
                        <i class="fa fa-life-ring text-info"></i> Support
                    </a>
                </div>
            `;
            nav.parentNode.insertBefore(hero, nav);
        }
    }

    // 3. Tab Icons & Live Row Count Badges
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
            iconClass = 'fa-sliders text-primary';
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

    // 4. Convert Checkboxes in Settings to iOS-Style Toggle Switches
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

    // 5. Enhance Table Rows with Client Avatar Circle & Copy Buttons
    const tables = wrapper.querySelectorAll('.table');
    tables.forEach(function (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(function (row) {
            const firstCell = row.cells[0];
            if (firstCell && !firstCell.querySelector('.ev-avatar-circle') && row.cells.length > 2) {
                const cellText = firstCell.textContent.trim();
                if (cellText && isNaN(cellText)) {
                    const initials = cellText.substring(0, 2).toUpperCase();
                    const avatar = document.createElement('span');
                    avatar.className = 'ev-avatar-circle';
                    avatar.textContent = initials;
                    firstCell.prepend(avatar);
                }
            }

            // Copy button for Emails & IPs
            row.querySelectorAll('td').forEach(function (cell) {
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
                                showToast(`Copied "${text}" to clipboard!`);
                                setTimeout(() => copyBtn.innerHTML = '<i class="fa fa-clone"></i>', 1800);
                            });
                        }
                    });

                    cell.appendChild(copyBtn);
                }
            });
        });

        // 6. Live Quick Search Box above tables
        if (rows.length > 2 && !table.closest('.ev-admin-wrapper')?.querySelector('.ev-quick-search-box')) {
            const searchBox = document.createElement('div');
            searchBox.className = 'ev-quick-search-box';
            searchBox.innerHTML = `
                <div class="ev-quick-search-input">
                    <i class="fa fa-search ev-quick-search-icon"></i>
                    <input type="text" class="form-control" placeholder="Search table rows...">
                </div>
            `;

            const input = searchBox.querySelector('input');
            input.addEventListener('input', function () {
                const q = this.value.toLowerCase().trim();
                rows.forEach(function (r) {
                    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
                });
            });

            table.closest('.table-responsive')?.parentNode.insertBefore(searchBox, table.closest('.table-responsive'));
        }
    });

    // 7. Auto-dismiss Success Alerts gently
    const successAlerts = wrapper.querySelectorAll('.alert-success');
    successAlerts.forEach(function (alert) {
        setTimeout(function () {
            alert.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-6px)';
            setTimeout(() => alert.style.display = 'none', 500);
        }, 5000);
    });
});
