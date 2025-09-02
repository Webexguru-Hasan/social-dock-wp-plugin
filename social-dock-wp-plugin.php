<?php
/**
 * Plugin Name:         Social Dock Wp Plugin
 * Plugin URI:          https://wordpress.org/plugins/social-dock-wp-plugin/
 * Description:         Social Link Integration Plugin For WordPress.
 * Version:             1.0.0
 * Requires at least:   5.2
 * Requires PHP:        7.4
 * Author:              Orphior Agency
 * Author URI:          https://hasan-wazid-portfolio.vercel.app/
 * License:             GPL-2.0+
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:          https://github.com/Webexguru-Hasan
 * Text Domain:         social-dock-wp-plugin
 * Domain Path:         /languages
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define constants FIRST
if ( ! defined( 'WPSD_VERSION' ) ) {
    define( 'WPSD_VERSION', '1.0.0' );
}
if ( ! defined( 'WPSD_FILE' ) ) {
    define( 'WPSD_FILE', __FILE__ );
}
if ( ! defined( 'WPSD_PATH' ) ) {
    define( 'WPSD_PATH', plugin_dir_path( __FILE__ ) );
}
if ( ! defined( 'WPSD_URL' ) ) {
    define( 'WPSD_URL', plugin_dir_url( __FILE__ ) );
}

//--------------------------
//Plugin Activation
//--------------------------
function wpsd_activate_plugin() {
    // Run database installation
    require_once WPSD_PATH . 'admin/db/install.php';
    wpsd_install_db();
}

register_activation_hook( __FILE__, 'wpsd_activate_plugin' );

// ----------------------------
// PLUGIN DEACTIVATION
// ----------------------------
function wpsd_deactivate_plugin() {
    // Don’t delete tables on deactivate, just clean up options/transients if needed
    // Example:
    // delete_option( 'wpsd_some_option' );
}
register_deactivation_hook( __FILE__, 'wpsd_deactivate_plugin' );


// ----------------------------
// PLUGIN UNINSTALL (delete plugin completely)
// ----------------------------
function wpsd_uninstall_plugin() {
    global $wpdb;

    $widget_table  = $wpdb->prefix . 'wpsd_widgets';
    $channel_table = $wpdb->prefix . 'wpsd_channels';

    // Drop custom tables
    $wpdb->query( "DROP TABLE IF EXISTS $channel_table" );
    $wpdb->query( "DROP TABLE IF EXISTS $widget_table" );
}
register_uninstall_hook( __FILE__, 'wpsd_uninstall_plugin' );


// Include DB insert functions
require_once plugin_dir_path(__FILE__) . 'admin/db/wpsd_crud.php';




// Include admin files
if ( is_admin() ) {
    require_once WPSD_PATH . 'admin/pages/dashboard.php';
    require_once WPSD_PATH . 'admin/pages/all-widgets.php';
    require_once WPSD_PATH . 'admin/pages/all-channels.php';
    require_once WPSD_PATH . 'admin/menu.php';
}

