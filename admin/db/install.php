<?php 

if ( ! defined( 'ABSPATH' ) ) exit;

function wpsd_install_db(){
    global $wpdb;
    // Widgets table
    
    $charset_collate = $wpdb->get_charset_collate();
    $widgets_table   = $wpdb->prefix . 'wpsd_widgets_db';
    $channels_table  = $wpdb->prefix . 'wpsd_channels_db';

     $widgets_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $widgets_table ) );
    $channels_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $channels_table ) );

     // create widgets table if missing
    if ( $widgets_exists !== $widgets_table ) {
        $sql1 = "CREATE TABLE {$widgets_table} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            user_name VARCHAR(191) NOT NULL DEFAULT '',
            widget_name VARCHAR(191) NOT NULL,
            style VARCHAR(191) NOT NULL DEFAULT '',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            ip_address VARCHAR(100) DEFAULT NULL,
            user_agent TEXT DEFAULT NULL,
            client_time VARCHAR(100) DEFAULT NULL,
            status TINYINT(1) NOT NULL DEFAULT 1,
            PRIMARY KEY (id),
            KEY widget_name (widget_name(50)),
            KEY status (status)
        ) $charset_collate;";

        $wpdb->query( $sql1 );
    }



        // create channels table if missing (no FK constraint; use index instead)
    if ( $channels_exists !== $channels_table ) {
        $sql2 = "CREATE TABLE {$channels_table} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            widget_id BIGINT(20) UNSIGNED NOT NULL,
            channel_name VARCHAR(191) NOT NULL,
            config LONGTEXT NULL,
            sequence INT(11) NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            status TINYINT(1) NOT NULL DEFAULT 1,
            PRIMARY KEY (id),
            KEY widget_id (widget_id),
            KEY status (status)
        ) $charset_collate;";

        $wpdb->query( $sql2 );
    }

     // Save schema version for future upgrades
    if ( ! get_option( 'wpsd_db_version' ) ) {
        add_option( 'wpsd_db_version', '1.0.0' );
    } else {
        update_option( 'wpsd_db_version', '1.0.0' );
    }

    // require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    // dbDelta( $sql1 );
    // dbDelta( $sql2 );
}

?>