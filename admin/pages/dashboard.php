<?php
if ( ! defined( 'ABSPATH' ) ) exit;

function wpsd_dashboard_page() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Social Dock Dashboard', 'social-dock' ); ?></h1>
        <p><?php esc_html_e( 'Welcome to Social Dock Plugin! Manage your social links easily.', 'social-dock' ); ?></p>
    </div>
    <?php
}
