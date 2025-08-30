<?php 

if ( ! defined( 'ABSPATH' ) ) exit;

function wpsd_install_db(){
    global $wpdb;
    // Widgets table
    $widgets_table = $wpdb->prefix . 'wpsd_widgets_db';
    $charset_collate = $wpdb->get_charset_collate();

    $sql1 = "CREATE TABLE $widgets_table(
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            user_name VARCHAR(191) DEFAULT '' NOT NULL,
            widget_name VARCHAR(191) NOT NULL,
            style VARCHAR(191) DEFAULT '' NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
            ip_address VARCHAR(100) DEFAULT NULL,
            user_agent TEXT DEFAULT NULL,
            time VARCHAR(100) DEFAULT NULL,
            status TINYINT(1) DEFAULT 1 NOT NULL,
            PRIMARY KEY (id)
    ) $charset_collate;";

 // Channels table
    $channels_table = $wpdb->prefix . 'wpsd_channels';
    $sql2 = "CREATE TABLE $channels_table (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        widget_id BIGINT(20) UNSIGNED NOT NULL,
        channel_name VARCHAR(191) NOT NULL,
        config LONGTEXT DEFAULT NULL,
        sequence INT(11) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        status TINYINT(1) DEFAULT 1 NOT NULL,
        PRIMARY KEY (id),
        KEY widget_id (widget_id),
        CONSTRAINT fk_widget FOREIGN KEY (widget_id) REFERENCES $widgets_table(id) ON DELETE CASCADE
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql1 );
    dbDelta( $sql2 );
}

?>