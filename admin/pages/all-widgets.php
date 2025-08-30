<?php
if ( ! defined( 'ABSPATH' ) ) exit;

// Enqueue assets for admin page
// Enqueue assets for admin page
add_action('admin_enqueue_scripts', 'wpsd_admin_assets');
function wpsd_admin_assets($hook) {
    // Debug: Uncomment to log current hook
    // error_log('Current Hook: ' . $hook);

    // Only load on All Widgets page
    if ( $hook === 'social-dock_page_wpsd_all_widgets' ) {
        wp_enqueue_style(
            'wpsd-admin-css',
            WPSD_URL . 'admin/css/admin-style.css',
            array(),
            WPSD_VERSION
        );

        wp_enqueue_script(
            'wpsd-admin-js',
            WPSD_URL . 'admin/js/admin-script.js',
            array('jquery'),
            WPSD_VERSION,
            true
        );
    }
}



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
    
    <!-- <script>
       
    </script> -->
    <div id="wpsd-toast"></div>
    <?php
}
