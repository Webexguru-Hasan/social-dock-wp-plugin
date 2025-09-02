<?php 

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Enqueue assets for admin page
add_action('admin_enqueue_scripts', 'wpsd_all_channels_admin_assets');
function wpsd_all_channels_admin_assets($hook) {
    // Only load on All Channels page
    // The hook name needs to match the one you defined in add_menu_page or add_submenu_page
    if ( $hook === 'social-dock_page_wpsd_all_channels' ) {
        wp_enqueue_style(
            'wpsd-admin-css',
            WPSD_URL . 'admin/css/admin-style.css',
            array(),
            WPSD_VERSION
        );

        // This enqueues admin-script.js and declares its dependency on jQuery
        wp_enqueue_script(
            'wpsd-admin-js',
            WPSD_URL . 'admin/js/admin-script.js',
            array('jquery'),
            WPSD_VERSION,
            true
        );
         wp_localize_script(
            'wpsd-admin-js',
            'wpsd_ajax',
            [
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'nonce'    => wp_create_nonce( 'wpsd_nonce' )
            ]
        );
    }
}

function wpsd_all_channels_page() {
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
    <?php
}
