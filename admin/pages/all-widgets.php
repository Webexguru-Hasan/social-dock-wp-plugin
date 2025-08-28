<?php
if ( ! defined( 'ABSPATH' ) ) exit;

// Enqueue assets for admin page
add_action('admin_enqueue_scripts', function($hook) {
    // Only load on our plugin page
    if (isset($_GET['page']) && $_GET['page'] === 'wpsd-all-widgets') {
        wp_enqueue_style('wpsd-admin-style', plugin_dir_url(__DIR__ . '/../../') . 'assets/css/admin-style.css');
        wp_enqueue_script('wpsd-admin-script', plugin_dir_url(__DIR__ . '/../../') . 'assets/js/admin-script.js', [], false, true);
    }
});

function wpsd_all_widgets_page() {
    ?>
    <div id="wpsd-header">
        <div class="wpsd-header-left">
            <img src="https://i.imgur.com/2yaf2wb.png" alt="Bit Assist Logo" class="wpsd-logo" />
            <span class="wpsd-title">Social Docs</span>
        </div>
        <div class="wpsd-header-right">
            <a href="https://www.youtube.com/" target="_blank" class="wpsd-header-btn wpsd-youtube">
                <span style="font-size:1.2em;">&#x25B6;</span> Tutorial
            </a>
            <a href="https://docs.example.com/" target="_blank" class="wpsd-header-btn">
                <span style="font-size:1.2em;">&#128196;</span> Documentation
            </a>
            <a href="https://review.example.com/" target="_blank" class="wpsd-header-btn">
                <span style="font-size:1.2em;">&#11088;</span> Review Us
            </a>
            <button id="wpsd-dark-toggle" class="wpsd-header-btn wpsd-toggle-btn" title="Toggle dark/light mode">
                <span id="wpsd-toggle-icon">&#9790;</span>
            </button>
        </div>
    </div>
    <div class="wpsd-widget-table-wrap">
        <div class="wpsd-widget-table-header">
            <span class="wpsd-widget-table-title">Widgets List</span>
            <a href="#" class="button button-primary" id="wpsd-add-widget-btn">
                <span style="font-size:1.3em;vertical-align:middle;">&#43;</span> Add Widget
            </a>
        </div>
        <table class="wpsd-widget-table">
            <thead>
                <tr>
                    <th>STATUS</th>
                    <th>WIDGET NAME</th>
                    <th>CREATED AT</th>
                    <th>USE WIDGET IN</th>
                </tr>
            </thead>
            <tbody id="wpsd-widgets-list">
                <tr id="wpsd-no-widgets-row">
                    <td colspan="4" style="text-align:center;">No widgets found! Create a new widget.</td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Modal HTML -->
    <div id="wpsd-modal-overlay" style="display:none;">
        <div id="wpsd-modal">
            <button id="wpsd-modal-close" aria-label="Close">&times;</button>
            <h2 style="margin-bottom:24px;font-size:1.5rem;font-weight:700;">Create New Widget</h2>
            <form id="wpsd-create-widget-form">
                <label for="wpsd-widget-name" style="display:block;font-weight:500;margin-bottom:8px;">Widget Name <span style="color:#A259FF;">*</span></label>
                <input type="text" id="wpsd-widget-name" name="widget_name" value="Untitled Widget" required
                    style="width:100%;padding:12px 16px;border-radius:8px;border:1px solid #E5E7EB;font-size:1rem;margin-bottom:32px;box-sizing:border-box;">
                <div style="display:flex;justify-content:flex-end;gap:12px;">
                    <button type="button" id="wpsd-modal-cancel" style="padding:10px 24px;border-radius:8px;border:none;background:#F3F4F6;color:#374151;font-weight:500;font-size:1rem;cursor:pointer;">Cancel</button>
                    <button type="submit" style="padding:10px 24px;border-radius:8px;border:none;background:#A259FF;color:#fff;font-weight:500;font-size:1rem;cursor:pointer;">Create</button>
                </div>
            </form>
        </div>
    </div>
    <style>
        body.wpsd-dark {
            background: #181A20 !important;
            color: #F3F4F6 !important;
        }
        body.wpsd-dark .wpsd-widget-table,
        body.wpsd-dark .wpsd-widget-table-header,
        body.wpsd-dark .wpsd-widget-table-wrap,
        body.wpsd-dark #wpsd-modal,
        body.wpsd-dark .wpsd-header-btn,
        body.wpsd-dark .wpsd-widget-site {
            background: #23262F !important;
            color: #F3F4F6 !important;
        }
        body.wpsd-dark .wpsd-widget-table th,
        body.wpsd-dark .wpsd-widget-table td {
            background: #2F234F !important;
            color: #F3F4F6 !important;
        }
         body.wpsd-dark .wpsd-title {
            
            color: #F3F4F6 !important;
        }
        body.wpsd-dark .wpsd-widget-site {
            background: #2F234F !important;
            color: #A259FF !important;
        }
        body.wpsd-dark .wpsd-header-btn {
            border-color: #23262F !important;
        }
        body.wpsd-dark #wpsd-toggle-icon {
            color: #FFD700 !important;
        }
        #wpsd-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 32px auto 0 auto;
            max-width: 900px;
            padding: 0 12px;
        }
        .wpsd-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .wpsd-logo {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: #E5E7EB;
            object-fit: contain;
        }
        .wpsd-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: #222;
            letter-spacing: 0.02em;
        }
        .wpsd-header-right {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .wpsd-header-btn {
            background: #F3F4F6;
            color: #374151;
            border: none;
            border-radius: 16px;
            padding: 8px 18px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
        }
        .wpsd-header-btn:hover {
            background: #E5E7EB;
        }
        .wpsd-youtube {
            color: #E24D4D;
            background: #FFF5F5;
        }
        .wpsd-youtube:hover {
            background: #FFE5E5;
        }
        .wpsd-toggle-btn {
            background: #F3F4F6;
            padding: 8px 14px;
            border-radius: 50%;
            min-width: 40px;
            min-height: 40px;
            justify-content: center;
        }
        #wpsd-toggle-icon {
            font-size: 1.3em;
            color: #A259FF;
        }
        .wpsd-widget-table-wrap {
            max-width: 900px;
            margin: 32px auto 0 auto;
            background: none;
        }
        .wpsd-widget-table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #F9FAFB;
            border-radius: 16px 16px 0 0;
            padding: 18px 32px;
            font-size: 1.2rem;
            font-weight: 700;
            color: #222;
            margin-bottom: 0;
        }
        .wpsd-widget-table-title {
            font-size: 1.1rem;
            font-weight: 700;
        }
        .wpsd-widget-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: #fff;
            border-radius: 0 0 16px 16px;
            box-shadow: 0 4px 24px rgba(31,41,55,0.08);
            /* overflow: hidden; */
        }
        .wpsd-widget-table th, .wpsd-widget-table td {
            padding: 18px 16px;
            text-align: left;
            font-size: 1rem;
            font-weight: 600;
            color: #222;
            border-bottom: 1px solid #F3F4F6;
        }
        .wpsd-widget-table th {
            background: #F9FAFB;
            font-weight: 700;
            font-size: 1rem;
            letter-spacing: 0.03em;
        }
        .wpsd-widget-table tr:last-child td {
            border-bottom: none;
        }
        .button.button-primary {
            background: #A259FF;
            color: #fff;
            border-radius: 12px;
            border: none;
            font-weight: 600;
            font-size: 1rem;
            padding: 10px 24px;
            box-shadow: none;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .button.button-primary:hover {
            background: #7C3AED;
        }
        /* Modal and widget styles remain unchanged */
        #wpsd-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(31, 41, 55, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        #wpsd-modal {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(31,41,55,0.12);
            padding: 40px 36px 32px 36px;
            min-width: 400px;
            max-width: 90vw;
            position: relative;
        }
        #wpsd-modal-close {
            position: absolute;
            top: 24px;
            right: 24px;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #374151;
            cursor: pointer;
        }
        #wpsd-modal-close:focus {
            outline: 2px solid #A259FF;
        }
        @media (max-width: 500px) {
            #wpsd-modal { min-width: 90vw; padding: 24px 12px; }
        }
        #wpsd-widgets-list {
            margin-top: 24px;
        }
        .wpsd-widget-card {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 8px rgba(31,41,55,0.06);
            display: flex;
            align-items: center;
            padding: 0 32px;
            min-height: 64px;
            margin-bottom: 16px;
        }
        .wpsd-widget-card-empty {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 8px rgba(31,41,55,0.06);
            padding: 24px 32px;
            color: #888;
            text-align: center;
            margin-bottom: 16px;
        }
        .wpsd-widget-status {
            margin-right: 24px;
        }
        .wpsd-switch {
            position: relative;
            display: inline-block;
            width: 36px;
            height: 20px;
        }
        .wpsd-switch input { display: none; }
        .wpsd-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #A259FF;
            border-radius: 20px;
            transition: .4s;
        }
        .wpsd-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background: #fff;
            border-radius: 50%;
            transition: .4s;
        }
        .wpsd-switch input:checked + .wpsd-slider {
            background: #A259FF;
        }
        .wpsd-switch input:checked + .wpsd-slider:before {
            transform: translateX(16px);
        }
        .wpsd-widget-name {
            font-weight: 600;
            color: #222;
            margin-right: 32px;
        }
        .wpsd-widget-date {
            color: #222;
            font-weight: 400;
            margin-right: auto;
        }
        .wpsd-widget-site {
            background: #F3EFFF;
            color: #A259FF;
            border-radius: 16px;
            padding: 6px 18px;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            margin-right: 16px;
        }
        .wpsd-widget-actions {
            position: relative;
        }
        .wpsd-tooltip-menu {
            display: none;
            position: absolute;
            top: 44px;
            right: 0;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(31,41,55,0.10);
            min-width: 160px;
            z-index: 100;
            padding: 8px 0;
        }
        .wpsd-tooltip-menu.active {
            display: block;
        }
        .wpsd-tooltip-menu button {
            background: none;
            border: none;
            width: 100%;
            text-align: left;
            padding: 10px 24px;
            font-size: 1rem;
            cursor: pointer;
            color: #222;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .wpsd-tooltip-menu button:hover {
            background: #F3F4F6;
        }
        .wpsd-tooltip-menu .wpsd-delete {
            color: #E24D4D;
        }
        /* Toast styles */
        #wpsd-toast {
            position: fixed;
            bottom: 32px;
            right: 32px;
            background: #222;
            color: #fff;
            padding: 14px 32px;
            border-radius: 12px;
            font-size: 1rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            z-index: 99999;
        }
        #wpsd-toast.show {
            opacity: 1;
            pointer-events: auto;
        }
        #wpsd-action-popup {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        }
        .wpsd-popup-bg {
            position: absolute;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(31,41,55,0.25);
        }
        .wpsd-popup-content {
            position: relative;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(31,41,55,0.12);
            padding: 32px 36px 24px 36px;
            min-width: 340px;
            max-width: 90vw;
            z-index: 2;
        }
    </style>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Dark/Light toggle
            var toggleBtn = document.getElementById('wpsd-dark-toggle');
            var toggleIcon = document.getElementById('wpsd-toggle-icon');
            var darkMode = localStorage.getItem('wpsd-dark') === 'true';
            function setDarkMode(on) {
                document.body.classList.toggle('wpsd-dark', on);
                toggleIcon.innerHTML = on ? '&#9728;' : '&#9790;';
                localStorage.setItem('wpsd-dark', on ? 'true' : 'false');
            }
            setDarkMode(darkMode);
            toggleBtn.addEventListener('click', function() {
                darkMode = !darkMode;
                setDarkMode(darkMode);
            });

            // Widget logic
            var addBtn = document.getElementById('wpsd-add-widget-btn');
            var overlay = document.getElementById('wpsd-modal-overlay');
            var closeBtn = document.getElementById('wpsd-modal-close');
            var cancelBtn = document.getElementById('wpsd-modal-cancel');
            var form = document.getElementById('wpsd-create-widget-form');
            var widgetsList = document.getElementById('wpsd-widgets-list');
            var noWidgetsRow = document.getElementById('wpsd-no-widgets-row');

            // LocalStorage DB functions
            function getWidgetsFromStorage() {
                try {
                    return JSON.parse(localStorage.getItem('wpsd_widgets') || '[]');
                } catch (e) { return []; }
            }
            function saveWidgetsToStorage(widgets) {
                localStorage.setItem('wpsd_widgets', JSON.stringify(widgets));
            }
            function addWidgetToStorage(widget) {
                var widgets = getWidgetsFromStorage();
                widgets.push(widget);
                saveWidgetsToStorage(widgets);
            }
            function updateWidgetInStorage(index, widget) {
                var widgets = getWidgetsFromStorage();
                widgets[index] = widget;
                saveWidgetsToStorage(widgets);
            }
            function deleteWidgetFromStorage(index) {
                var widgets = getWidgetsFromStorage();
                widgets.splice(index, 1);
                saveWidgetsToStorage(widgets);
            }

            // Render widgets from storage
            function renderWidgets() {
                widgetsList.innerHTML = '';
                var widgets = getWidgetsFromStorage();
                if (widgets.length === 0) {
                    var emptyRow = document.createElement('tr');
                    emptyRow.id = 'wpsd-no-widgets-row';
                    emptyRow.innerHTML = '<td colspan="4" style="text-align:center;">No widgets found! Create a new widget.</td>';
                    widgetsList.appendChild(emptyRow);
                    return;
                }
                widgets.forEach(function(widget, idx) {
                    var tr = document.createElement('tr');
                    tr.className = 'wpsd-widget-row';
                    tr.innerHTML = `
                        <td>
                            <label class="wpsd-switch">
                                <input type="checkbox" ${widget.status ? 'checked' : ''}>
                                <span class="wpsd-slider"></span>
                            </label>
                        </td>
                        <td class="wpsd-widget-name">${widget.name}</td>
                        <td class="wpsd-widget-date">${widget.date}</td>
                        <td style="display:flex;align-items:center;gap:12px;">
                            <button class="wpsd-widget-site">This site</button>
                            <span class="wpsd-widget-actions" style="position:relative;">
                                <button class="wpsd-dots" style="background:#F3F4F6;border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
                                    <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                                </button>
                                <div class="wpsd-tooltip-menu">
                                    <button class="wpsd-edit"><span>✏️</span> Edit</button>
                                    <button class="wpsd-duplicate"><span>📄</span> Duplicate</button>
                                    <button class="wpsd-delete"><span>🗑️</span> Delete</button>
                                </div>
                            </span>
                        </td>
                    `;
                    widgetsList.appendChild(tr);

                    // Tooltip logic
                    var dots = tr.querySelector('.wpsd-dots');
                    var tooltip = tr.querySelector('.wpsd-tooltip-menu');
                    dots.addEventListener('click', function(e) {
                        e.stopPropagation();
                        document.querySelectorAll('.wpsd-tooltip-menu').forEach(t => t.classList.remove('active'));
                        tooltip.classList.toggle('active');
                    });

                    // Edit logic
                    tooltip.querySelector('.wpsd-edit').addEventListener('click', function(e) {
                        e.stopPropagation();
                        tooltip.classList.remove('active');
                        showPopup('edit', widget.name, function(newName) {
                            widget.name = newName;
                            updateWidgetInStorage(idx, widget);
                            renderWidgets();
                            showToast('Widget updated!');
                        });
                    });

                    // Duplicate logic
                    tooltip.querySelector('.wpsd-duplicate').addEventListener('click', function(e) {
                        e.stopPropagation();
                        tooltip.classList.remove('active');
                        var newWidget = Object.assign({}, widget);
                        newWidget.name = widget.name + ' Copy';
                        addWidgetToStorage(newWidget);
                        renderWidgets();
                        showToast('Widget duplicated!');
                    });

                    // Delete logic
                    tooltip.querySelector('.wpsd-delete').addEventListener('click', function(e) {
                        e.stopPropagation();
                        tooltip.classList.remove('active');
                        showPopup('delete', widget.name, function() {
                            deleteWidgetFromStorage(idx);
                            renderWidgets();
                            showToast('Widget deleted!');
                        });
                    });

                    // Status toggle logic
                    tr.querySelector('.wpsd-switch input').addEventListener('change', function(e) {
                        widget.status = this.checked;
                        updateWidgetInStorage(idx, widget);
                    });
                });
            }

            // Initial render
            renderWidgets();

            addBtn.addEventListener('click', function(e) {
                e.preventDefault();
                overlay.style.display = 'flex';
            });
            closeBtn.addEventListener('click', function() {
                overlay.style.display = 'none';
            });
            cancelBtn.addEventListener('click', function() {
                overlay.style.display = 'none';
            });
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) overlay.style.display = 'none';
            });

            function showToast(message) {
                let toast = document.getElementById('wpsd-toast');
                if (!toast) {
                    toast = document.createElement('div');
                    toast.id = 'wpsd-toast';
                    document.body.appendChild(toast);
                }
                toast.textContent = message;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2500);
            }

            // --- POPUP HTML ---
            function showPopup(type, widgetName, onConfirm) {
                let popup = document.getElementById('wpsd-action-popup');
                if (!popup) {
                    popup = document.createElement('div');
                    popup.id = 'wpsd-action-popup';
                    popup.innerHTML = `
                        <div class="wpsd-popup-bg"></div>
                        <div class="wpsd-popup-content"></div>
                    `;
                    document.body.appendChild(popup);
                }
                popup.style.display = 'flex';
                let content = popup.querySelector('.wpsd-popup-content');
                if (type === 'edit') {
                    content.innerHTML = `
                        <h3 style="margin-bottom:18px;">Edit Widget</h3>
                        <label style="font-weight:500;">Widget Name</label>
                        <input type="text" id="wpsd-edit-name" value="${widgetName}" style="width:100%;margin-bottom:24px;padding:10px 16px;border-radius:8px;border:1px solid #E5E7EB;">
                        <div style="display:flex;justify-content:flex-end;gap:12px;">
                            <button id="wpsd-popup-cancel" class="button" style="background:#F3F4F6;color:#374151;">Cancel</button>
                            <button id="wpsd-popup-confirm" class="button button-primary">Save</button>
                        </div>
                    `;
                    content.querySelector('#wpsd-popup-cancel').onclick = () => popup.style.display = 'none';
                    content.querySelector('#wpsd-popup-confirm').onclick = () => {
                        let newName = content.querySelector('#wpsd-edit-name').value;
                        popup.style.display = 'none';
                        onConfirm(newName);
                    };
                } else if (type === 'delete') {
                    content.innerHTML = `
                        <h3 style="margin-bottom:18px;">Delete Widget</h3>
                        <p style="margin-bottom:24px;">Are you sure you want to delete <b>${widgetName}</b>?</p>
                        <div style="display:flex;justify-content:flex-end;gap:12px;">
                            <button id="wpsd-popup-cancel" class="button" style="background:#F3F4F6;color:#374151;">Cancel</button>
                            <button id="wpsd-popup-confirm" class="button button-primary" style="background:#E24D4D;">Delete</button>
                        </div>
                    `;
                    content.querySelector('#wpsd-popup-cancel').onclick = () => popup.style.display = 'none';
                    content.querySelector('#wpsd-popup-confirm').onclick = () => {
                        popup.style.display = 'none';
                        onConfirm();
                    };
                }
                popup.querySelector('.wpsd-popup-bg').onclick = () => popup.style.display = 'none';
            }

            // --- WIDGET ROW LOGIC ---
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var widgetName = document.getElementById('wpsd-widget-name').value || 'Untitled Widget';
                var today = new Date();
                var dateStr = today.toLocaleDateString('en-GB'); // DD/MM/YYYY

                var widget = {
                    name: widgetName,
                    date: dateStr,
                    status: true
                };
                addWidgetToStorage(widget);
                renderWidgets();

                overlay.style.display = 'none';
                form.reset();
                document.getElementById('wpsd-widget-name').value = 'Untitled Widget';
            });
        });
    </script>
    <div id="wpsd-toast"></div>
    <?php
}
