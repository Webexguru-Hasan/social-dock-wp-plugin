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


// Include admin files
if ( is_admin() ) {
    require_once WPSD_PATH . 'admin/pages/dashboard.php';
    require_once WPSD_PATH . 'admin/pages/all-widgets.php';
    require_once WPSD_PATH . 'admin/menu.php';
}

