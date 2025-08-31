<?php

if( ! defined( 'ABSPATH' ) ) exit;

function wpsd_insert_data($data) {
    global $wpdb;
   
    $table = $wpdb->prefix . 'wpsd_widgets_db';

    // Ensure required values
    $defaults = [
        'user_name'   => '',
        'widget_name' => '',
        'style'       => '',
        'created_at'  => current_time( 'mysql' ),
        'updated_at'  => current_time( 'mysql' ),
        'ip_address'  => isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '',
        'user_agent'  => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_textarea_field($_SERVER['HTTP_USER_AGENT']) : '',
        'time'        => current_time( 'mysql' ),
        'status'      => 1,
    ];

     $data = wp_parse_args( $data, $defaults );

    $inserted = $wpdb->insert( $table, $data );

    if ( $inserted ) {
        return $wpdb->insert_id; // return new widget ID
    }

    return false;
}

// Handle AJAX request to insert widget
add_action( 'wp_ajax_wpsd_create_widget', 'wpsd_create_widget_callback' );

function wpsd_create_widget_callback() {
    // Security check
    console.log('AJAX callback triggered');
    check_ajax_referer( 'nonce', 'security' );

    $data = [
        'user_name'   => sanitize_text_field( $_POST['user_name'] ),
        'widget_name' => sanitize_text_field( $_POST['widget_name'] ),
        'style'       => sanitize_text_field( $_POST['style'] ),
        'created_at'  => current_time( 'mysql' ),
        'updated_at'  => current_time( 'mysql' ),
        'ip_address'  => isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '',
        'user_agent'  => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_textarea_field($_SERVER['HTTP_USER_AGENT']) : '',
        'time'        => current_time( 'mysql' ),
        'status'      => 1,
    ];

    $widget_id = wpsd_insert_data( $data );

    if ( $widget_id ) {
        // Fetch the inserted row for display
        global $wpdb;
        $table = $wpdb->prefix . 'wpsd_widgets_db';
        $widget = $wpdb->get_row( $wpdb->prepare( "SELECT status, widget_name, created_at FROM $table WHERE id = %d", $widget_id ), ARRAY_A );
        wp_send_json_success([ 'id' => $widget_id, 'message' => 'Widget created!', 'widget' => $widget ]);
    } else {
        wp_send_json_error([ 'message' => 'Failed to create widget' ]);
    }
    wp_die();
}

?>

