<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Enqueue assets for admin page
add_action('admin_enqueue_scripts', 'wpsd_all_channels_admin_assets');
function wpsd_all_channels_admin_assets() {
    // Check for the 'wpsd_all_channels' page slug in the URL
    // This is more robust and works for hidden pages.
    if ( isset($_GET['page']) && $_GET['page'] === 'wpsd_all_channels' ) {
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
                <span class="wpsd-header-icon">&#x25B6;</span> Tutorial
            </a>
            <a href="https://docs.example.com/" target="_blank" class="wpsd-header-btn">
                <span class="wpsd-header-icon">&#128196;</span> Documentation
            </a>
            <a href="https://review.example.com/" target="_blank" class="wpsd-header-btn">
                <span class="wpsd-header-icon">&#11088;</span> Review Us
            </a>
            <button id="wpsd-dark-toggle" class="wpsd-header-btn wpsd-toggle-btn" title="Toggle dark/light mode">
                <span id="wpsd-toggle-icon">&#9790;</span>
            </button>
        </div>
    </div>
    <div class="wpsd-nav-bar">
        <button class="wpsd-nav-back">&#8592;</button>
        <nav class="wpsd-nav-tabs">
            <button class="wpsd-nav-tab wpsd-nav-tab-active">Channels</button>
            <button class="wpsd-nav-tab">Customizations</button>
            <button class="wpsd-nav-tab">Settings</button>
            <button class="wpsd-nav-tab">External publish</button>
        </nav>
    </div>
        <div class="wpsd-channels-create-wrap">
                <button class="wpsd-add-channel-btn">+ Add Channel</button>
                <div style="margin-top:18px;font-size:1.2rem;color:#374151;">Create new channel from here.</div>
                
        </div>

            <!-- Modal for adding a new channel -->
            <div id="wpsd-add-channel-modal" class="wpsd-modal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.18);z-index:9999;align-items:center;justify-content:center;">
                <div class="wpsd-modal-content" style="background:#fff;border-radius:24px;max-width:700px;width:95vw;padding:32px 32px 24px 32px;box-shadow:0 2px 24px rgba(0,0,0,0.18);position:relative;">
                    <button id="wpsd-modal-close" style="position:absolute;top:18px;right:18px;background:none;border:none;font-size:1.5rem;cursor:pointer;">&times;</button>
                    <h2 style="font-size:2rem;font-weight:700;margin-bottom:24px;">Create New Channel</h2>
                    <!-- Search -->
                    <input type="text" id="wpsd-search-input" placeholder="Search" value="" style="width:100%;margin-bottom:24px;padding:12px 18px;border-radius:12px;border:1px solid #E5E7EB;font-size:1.1rem;">
                    

                    <!-- Channel Grid -->
                    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:24px;max-height:420px;overflow-y:auto;">
                        <!-- Instagram -->
                            <div class="wpsd-widget-card" data-channel="instagram" style="background:#F8FAFC;border-radius:16px;padding:18px 0;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width:40px;height:40px;" />
                            <div style="font-size:1rem;font-weight:500;color:#374151;">Instagram</div>
                        </div>
                        <!-- Messenger -->
                            <div class="wpsd-widget-card" data-channel="messenger" style="background:#F8FAFC;border-radius:16px;padding:18px 0;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111624.png" alt="Messenger" style="width:40px;height:40px;" />
                            <div style="font-size:1rem;font-weight:500;color:#374151;">Messenger</div>
                        </div>
                        <!-- Twitter -->
                            <div class="wpsd-widget-card" data-channel="twitter" style="background:#F8FAFC;border-radius:16px;padding:18px 0;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width:40px;height:40px;" />
                            <div style="font-size:1rem;font-weight:500;color:#374151;">Twitter</div>
                        </div>
                        <!-- YouTube -->
                            <div class="wpsd-widget-card" data-channel="youtube" style="background:#F8FAFC;border-radius:16px;padding:18px 0;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;">
                            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" style="width:40px;height:40px;" />
                            <div style="font-size:1rem;font-weight:500;color:#374151;">YouTube</div>
                        </div>
                        <!-- LinkedIn -->
                            <div class="wpsd-widget-card" data-channel="linkedin" style="background:#F8FAFC;border-radius:16px;padding:18px 0;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;">
                            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width:40px;height:40px;" />
                            <div style="font-size:1rem;font-weight:500;color:#374151;">LinkedIn</div>
                        </div>
                        <!-- Call -->
                            <div class="wpsd-widget-card" data-channel="call" style="background:#F8FAFC;border-radius:16px;padding:18px 0;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;">
                            <img src="https://cdn-icons-png.flaticon.com/512/597/597177.png" alt="Call" style="width:40px;height:40px;" />
                            <div style="font-size:1rem;font-weight:500;color:#374151;">Call</div>
                        </div>
                        <!-- Pinterest -->
                            <div class="wpsd-widget-card" data-channel="pinterest" style="background:#F8FAFC;border-radius:16px;padding:18px 0;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733646.png" alt="Pinterest" style="width:40px;height:40px;" />
                            <div style="font-size:1rem;font-weight:500;color:#374151;">Pinterest</div>
                        </div>
                        <!-- WhatsApp -->
                            <div class="wpsd-widget-card" data-channel="whatsapp" style="background:#F8FAFC;border-radius:16px;padding:18px 0;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width:40px;height:40px;" />
                            <div style="font-size:1rem;font-weight:500;color:#374151;">WhatsApp</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- New Modal Popup for creating/editing a channel -->
    
            <div id="wpsd-channel-form-modal" class="wpsd-modal" style="display:none;">
        <div class="wpsd-modal-content wpsd-channel-form-modal-content">
            <div class="wpsd-channel-form-header">
                <button class="wpsd-channel-form-back-btn">&larr;</button>
                <div class="wpsd-channel-form-header-title">Create New Channel</div>
                <div class="wpsd-channel-form-header-right">
                    <a href="https://www.youtube.com/" target="_blank" class="wpsd-channel-form-btn wpsd-youtube">
                        <span class="wpsd-header-icon">&#x25B6;</span> Tutorial
                    </a>
                    <a href="https://docs.example.com/" target="_blank" class="wpsd-channel-form-btn">
                        <span class="wpsd-header-icon">&#128196;</span> Documentation
                    </a>
                    <button class="wpsd-channel-save-btn">Save</button>
                </div>
                <button class="wpsd-channel-form-close-btn">&times;</button>
            </div>
            <div class="wpsd-channel-form-body">
                <div class="wpsd-form-group">
                    <label for="wpsd-channel-title">Title</label>
                    <input type="text" id="wpsd-channel-title" name="wpsd_channel_title" required>
                </div>

                <div class="wpsd-form-group">
                    <label>Custom image</label>
                    <div class="wpsd-custom-image-upload">
                        <img id="wpsd-channel-icon-preview" src="" alt="Channel Icon">
                        <div class="wpsd-upload-btn-wrap">
                            <input type="file" id="wpsd-image-upload-input" accept="image/*" style="display: none;">
                            <button id="wpsd-image-upload-btn" class="wpsd-upload-btn">
                                <span class="wpsd-upload-icon">⬆</span> Browse
                            </button>
                        </div>
                    </div>
                    <span class="wpsd-image-size-note">image size: 40 * 40px</span>
                </div>

                <div class="wpsd-form-group" id="wpsd-logical-input-group">
                    <label id="wpsd-logical-input-label" for="wpsd-logical-input">Channel ID</label>
                    <input type="text" id="wpsd-logical-input" name="wpsd_logical_input" required>
                </div>

                <div class="wpsd-form-group" id="wpsd-message-input-group" style="display:none;">
                    <label for="wpsd-message-input">Message</label>
                    <textarea id="wpsd-message-input" name="wpsd_message" rows="4"></textarea>
                </div>
                
                <div class="wpsd-form-group">
                    <label for="wpsd-target-select">On click open channel on</label>
                    <select id="wpsd-target-select" name="wpsd_target">
                        <option value="_blank">New Tab</option>
                        <option value="_self">Current Tab</option>
                        <option value="_new">New Window</option>
                    </select>
                </div>

                <div class="wpsd-form-group wpsd-flex-between">
                    <div>
                        <label for="wpsd-office-hours-toggle">Hide this channel after office hour</label>
                        <p class="wpsd-subtext">Hide this channel after office time.</p>
                    </div>
                    <label class="wpsd-switch">
                        <input type="checkbox" id="wpsd-office-hours-toggle">
                        <span class="wpsd-slider"></span>
                    </label>
                    <button class="wpsd-pro-btn">Get Pro Version</button>
                </div>
                
                <div class="wpsd-form-group wpsd-channel-show-on">
                    <label>Channel Show on</label>
                    <div class="wpsd-checkbox-group">
                        <div class="wpsd-checkbox-item">
                            <input type="checkbox" id="wpsd-show-desktop" name="wpsd_show_desktop" checked>
                            <label for="wpsd-show-desktop">Desktop</label>
                        </div>
                        <div class="wpsd-checkbox-item">
                            <input type="checkbox" id="wpsd-show-mobile" name="wpsd_show_mobile" checked>
                            <label for="wpsd-show-mobile">Mobile</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
            
    <?php
}
