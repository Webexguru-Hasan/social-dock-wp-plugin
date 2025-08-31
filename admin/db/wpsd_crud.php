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
    error_log('AJAX callback triggered');
    check_ajax_referer( 'wpsd_nonce', 'security' );

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

// 🔹 For logged-in users
add_action( 'wp_ajax_wpsd_get_widgets', 'wpsd_get_widgets_callback' );
 
// 🔹 For guests (not logged in)
add_action( 'wp_ajax_nopriv_wpsd_get_widgets', 'wpsd_get_widgets_callback' );

function wpsd_get_widgets_callback() {
    error_log('--- [wpsd_get_widgets_callback STARTED] ---');

    
     check_ajax_referer( 'wpsd_nonce', 'security', false );

    
   

    // ✅ Step 2: Access database
    global $wpdb;
    $table = $wpdb->prefix . 'wpsd_widgets_db';
    

    // ✅ Step 3: Run query
    $query = "SELECT id, widget_name, style, status, created_at FROM $table ORDER BY created_at DESC";
    

    $widgets = $wpdb->get_results( $query, ARRAY_A );

    // ✅ Step 4: Check results
    if ( ! empty( $widgets ) ) {
      
        wp_send_json_success( [ 'widgets' => $widgets ] );
    } else {
        
        wp_send_json_error( [ 'message' => 'No widgets found' ] );
    }

    
    wp_die();
}


/**
 * Update widget (Edit)
 */
add_action( 'wp_ajax_wpsd_update_widget', 'wpsd_update_widget_callback' );

function wpsd_update_widget_callback() {
    global $wpdb;
    $table = $wpdb->prefix . 'wpsd_widgets_db';

    error_log('--- [wpsd_update_widget_callback STARTED] ---');
    error_log('RAW POST: ' . print_r($_POST, true));

    // Security check
    check_ajax_referer( 'wpsd_nonce', 'security' );

    // Sanitize & fetch
    $widget_id   = isset($_POST['widget_id']) ? intval($_POST['widget_id']) : 0;
    $widget_name = isset($_POST['widget_name']) ? sanitize_text_field($_POST['widget_name']) : '';
    $style       = isset($_POST['style']) ? sanitize_text_field($_POST['style']) : '';

    error_log("Received widget_id: $widget_id");
    error_log("Received widget_name: $widget_name");
    error_log("Received style: $style");

    if ( $widget_id <= 0 || empty($widget_name) ) {
        error_log("❌ Invalid data: widget_id=$widget_id, widget_name=$widget_name");
        wp_send_json_error([ 'message' => 'Invalid widget data' ]);
    }

    $updated = $wpdb->update(
        $table,
        [
            'widget_name' => $widget_name,
            'style'       => $style,
            'updated_at'  => current_time('mysql')
        ],
        [ 'id' => $widget_id ],
        [ '%s', '%s', '%s' ],
        [ '%d' ]
    );

    if ( $updated !== false ) {
        error_log("✅ Widget $widget_id updated successfully");
        wp_send_json_success([ 'message' => 'Widget updated successfully' ]);
    } else {
        error_log("❌ Update failed for widget $widget_id");
        wp_send_json_error([ 'message' => 'Update failed or no changes' ]);
    }

    wp_die();
}

/**
 * delete widget
 */
// For logged-in users
add_action( 'wp_ajax_wpsd_delete_widget', 'wpsd_delete_widget_callback' );
// For guests (optional, only if you allow)
add_action( 'wp_ajax_nopriv_wpsd_delete_widget', 'wpsd_delete_widget_callback' );

function wpsd_delete_widget_callback() {
    global $wpdb;

    error_log('--- [wpsd_delete_widget_callback STARTED] ---');

    // ✅ Security check
    if ( ! check_ajax_referer( 'wpsd_nonce', 'security', false ) ) {
        error_log('[WPSD][Delete] Nonce verification failed');
        wp_send_json_error([ 'message' => 'Security check failed' ]);
    }

    // ✅ Validate widget_id
    $widget_id = isset($_POST['widget_id']) ? intval($_POST['widget_id']) : 0;
    if ( $widget_id <= 0 ) {
        error_log('[WPSD][Delete] Invalid widget_id received: ' . print_r($_POST, true));
        wp_send_json_error([ 'message' => 'Invalid widget ID' ]);
    }

    // ✅ Table name (⚠️ must match your DB table)
    $table = $wpdb->prefix . "wpsd_widgets_db";
    error_log('[WPSD][Delete] Using table: ' . $table);

    // ✅ Run delete query
    $deleted = $wpdb->delete(
        $table,
        [ 'id' => $widget_id ],
        [ '%d' ]
    );

    if ( $deleted === false ) {
        // DB error
        error_log('[WPSD][Delete] DB error: ' . $wpdb->last_error);
        wp_send_json_error([ 'message' => 'Database error: ' . $wpdb->last_error ]);
    } elseif ( $deleted === 0 ) {
        // No row deleted
        error_log('[WPSD][Delete] No widget found with ID: ' . $widget_id);
        wp_send_json_error([ 'message' => 'Widget not found' ]);
    } else {
        // Success 🎉
        error_log('[WPSD][Delete] Widget deleted successfully. ID: ' . $widget_id);
        wp_send_json_success([ 'message' => 'Widget deleted', 'deleted_id' => $widget_id ]);
    }

    error_log('--- [wpsd_delete_widget_callback ENDED] ---');
    wp_die();
}


/**
 * Duplicate widget
 */

function wpsd_duplicate_widget_callback() {
    global $wpdb;

    error_log('[WPSD][Duplicate] Callback triggered');

    // Security check
    check_ajax_referer('wpsd_nonce', 'security');

    $table = $wpdb->prefix . 'wpsd_widgets_db';

    $widget_id = intval($_POST['widget_id']);
    error_log("[WPSD][Duplicate] Widget ID to duplicate: " . $widget_id);

    // Get original widget
    $widget = $wpdb->get_row(
        $wpdb->prepare("SELECT * FROM $table WHERE id = %d", $widget_id),
        ARRAY_A
    );

    if (!$widget) {
        error_log("[WPSD][Duplicate] Original widget not found");
        wp_send_json_error(['message' => 'Original widget not found']);
    }

    // Prepare new data
    $new_data = [
        'widget_name' => $widget['widget_name'] . ' Copy',
        'style'       => $widget['style'],
        'status'      => $widget['status'],
        'created_at'  => current_time('mysql'),
        'updated_at'  => current_time('mysql'),
        'ip_address'  => isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '',
        'user_agent'  => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_textarea_field($_SERVER['HTTP_USER_AGENT']) : '',
        'time'        => current_time('mysql'), 
        'user_name'   => $widget['user_name'],
        
    ];

    error_log("[WPSD][Duplicate] New widget data: " . print_r($new_data, true));

    // Insert duplicate
    $inserted = $wpdb->insert($table, $new_data);

    if ($inserted === false) {
        error_log("[WPSD][Duplicate] DB insert failed: " . $wpdb->last_error);
        wp_send_json_error(['message' => 'DB insert failed', 'error' => $wpdb->last_error]);
    }

    $new_id = $wpdb->insert_id;
    error_log("[WPSD][Duplicate] New widget inserted with ID: " . $new_id);

    wp_send_json_success(['message' => 'Widget duplicated', 'new_id' => $new_id]);
}
add_action('wp_ajax_wpsd_duplicate_widget', 'wpsd_duplicate_widget_callback');