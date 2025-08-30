<?php
if ( ! defined( 'ABSPATH' ) ) exit;

function wpsd_register_admin_menu() {
    add_menu_page(
        __( 'Social Dock', 'social-dock' ),
        __( 'Social Dock', 'social-dock' ),
        'manage_options',
        'wpsd_dashboard',
        'wpsd_dashboard_page',
        'dashicons-share',
        25
    );

    add_submenu_page(
        'wpsd_dashboard',
        __( 'All Widgets', 'social-dock' ),
        __( 'All Widgets', 'social-dock' ),
        'manage_options',
        'wpsd_all_widgets',
        'wpsd_all_widgets_page'
    );
}
add_action( 'admin_menu', 'wpsd_register_admin_menu' );


