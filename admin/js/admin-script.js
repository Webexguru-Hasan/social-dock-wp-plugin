/**
 * All admin-side JavaScript logic for the Social Dock plugin.
 * This script handles dark mode, widget management, and channel management.
 */
document.addEventListener("DOMContentLoaded", function () {
  // ======================================================================
  // Dark/Light toggle logic
  // ======================================================================
  var toggleBtn = document.getElementById("wpsd-dark-toggle");
  var toggleIcon = document.getElementById("wpsd-toggle-icon");
  var darkMode = localStorage.getItem("wpsd-dark") === "true";

  function setDarkMode(on) {
    document.body.classList.toggle("wpsd-dark", on);
    toggleIcon.innerHTML = on ? "&#9728;" : "&#9790;";
    localStorage.setItem("wpsd-dark", on ? "true" : "false");
  }

  setDarkMode(darkMode);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      darkMode = !darkMode;
      setDarkMode(darkMode);
    });
  }

  // ======================================================================
  // Widget management logic
  // ======================================================================
  const addBtn = document.getElementById("wpsd-add-widget-btn");
  const overlay = document.getElementById("wpsd-modal-overlay");
  const closeBtn = document.getElementById("wpsd-modal-close");
  const cancelBtn = document.getElementById("wpsd-modal-cancel");
  const form = document.getElementById("wpsd-create-widget-form");
  const widgetsList = document.getElementById("wpsd-widgets-list");

  /**
   * Asynchronously fetches widgets from the server using the native fetch API
   * and renders them to the page.
   */
  async function renderWidgets() {
    const formData = new URLSearchParams();
    formData.append("action", "wpsd_get_widgets");
    formData.append("security", wpsd_ajax.nonce);

    try {
      const response = await fetch(wpsd_ajax.ajax_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (widgetsList) {
        widgetsList.innerHTML = "";

        if (
          result.success &&
          result.data &&
          result.data.widgets &&
          result.data.widgets.length > 0
        ) {
          result.data.widgets.forEach(function (widget) {
            const tr = document.createElement("tr");
            tr.className = "wpsd-widget-row";
            tr.innerHTML = `
              <td>
                <label class="wpsd-switch">
                  <input type="checkbox" ${widget.status == 1 ? "checked" : ""}>
                  <span class="wpsd-slider"></span>
                </label>
              </td>
              <td class="wpsd-widget-name">${widget.widget_name}</td>
              <td class="wpsd-widget-date">${widget.created_at}</td>
              <td style="display:flex;align-items:center;gap:12px;">
                <button class="wpsd-widget-site">This site</button>
                <span class="wpsd-widget-actions" style="position:relative;">
                  <button class="wpsd-dots" style="background:#F3F4F6;border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
                    <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                  </button>
                  <div class="wpsd-tooltip-menu">
                    <button class="wpsd-edit"><span>✏️</span>Edit</button>
                    <button class="wpsd-duplicate"><span>📄</span> Duplicate</button>
                    <button class="wpsd-delete"><span>🗑️</span> Delete</button>
                  </div>
                </span>
              </td>
            `;
            widgetsList.appendChild(tr);

            // Add click listener to the widget name to redirect
            const widgetNameCell = tr.querySelector(".wpsd-widget-name");
            widgetNameCell.addEventListener("click", function () {
              window.location.href = `admin.php?page=wpsd_all_channels&widget_id=${widget.id}`;
            });

            // Prevent propagation from children elements that should not trigger redirect
            const switchInput = tr.querySelector(".wpsd-switch input");
            const siteButton = tr.querySelector(".wpsd-widget-site");
            const actionsSpan = tr.querySelector(".wpsd-widget-actions");
            const tooltipMenu = tr.querySelector(".wpsd-tooltip-menu");
            const tooltipButtons = tooltipMenu
              ? tooltipMenu.querySelectorAll("button")
              : [];

            [switchInput, siteButton, actionsSpan, ...tooltipButtons].forEach(
              function (btn) {
                if (btn) {
                  btn.addEventListener("click", function (e) {
                    e.stopPropagation();
                  });
                }
              }
            );

            // Tooltip logic
            const dots = tr.querySelector(".wpsd-dots");
            const tooltip = tr.querySelector(".wpsd-tooltip-menu");
            if (dots && tooltip) {
              dots.addEventListener("click", function (e) {
                e.stopPropagation();
                document
                  .querySelectorAll(".wpsd-tooltip-menu")
                  .forEach((t) => t.classList.remove("active"));
                tooltip.classList.toggle("active");
              });
            }

            // Edit logic using fetch API
            const editButton = tooltip.querySelector(".wpsd-edit");
            if (editButton) {
              editButton.addEventListener("click", function (e) {
                e.stopPropagation();
                tooltip.classList.remove("active");
                showPopup("edit", widget.widget_name, async function (newName) {
                  const updateFormData = new URLSearchParams();
                  updateFormData.append("action", "wpsd_update_widget");
                  updateFormData.append("security", wpsd_ajax.nonce);
                  updateFormData.append("widget_id", widget.id);
                  updateFormData.append("widget_name", newName);

                  try {
                    const updateResponse = await fetch(wpsd_ajax.ajax_url, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      body: updateFormData,
                    });

                    const updateResult = await updateResponse.json();
                    if (updateResult.success) {
                      showToast("Widget updated!");
                      renderWidgets();
                    } else {
                      showToast(
                        "❌ Failed to update: " + updateResult.data.message
                      );
                    }
                  } catch (error) {
                    console.error("Failed to update widget:", error);
                    showToast(
                      "❌ Failed to update widget. Check console for details."
                    );
                  }
                });
              });
            }

            // Duplicate logic using fetch API
            const duplicateButton = tooltip.querySelector(".wpsd-duplicate");
            if (duplicateButton) {
              duplicateButton.addEventListener("click", async function (e) {
                e.stopPropagation();
                tooltip.classList.remove("active");

                const duplicateFormData = new URLSearchParams();
                duplicateFormData.append("action", "wpsd_duplicate_widget");
                duplicateFormData.append("security", wpsd_ajax.nonce);
                duplicateFormData.append("widget_id", widget.id);

                try {
                  const duplicateResponse = await fetch(wpsd_ajax.ajax_url, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: duplicateFormData,
                  });

                  const duplicateResult = await duplicateResponse.json();
                  if (duplicateResult.success) {
                    showToast(
                      "✅ Widget duplicated! (New ID: " +
                        duplicateResult.data.new_id +
                        ")"
                    );
                    renderWidgets();
                  } else {
                    showToast(
                      "❌ Failed to duplicate: " + duplicateResult.data.message
                    );
                  }
                } catch (error) {
                  console.error("Failed to duplicate widget:", error);
                  showToast(
                    "❌ Failed to duplicate widget. Check console for details."
                  );
                }
              });
            }

            // Delete logic using fetch API
            const deleteButton = tooltip.querySelector(".wpsd-delete");
            if (deleteButton) {
              deleteButton.addEventListener("click", function (e) {
                e.stopPropagation();
                tooltip.classList.remove("active");
                showPopup("delete", widget.widget_name, async function () {
                  const deleteFormData = new URLSearchParams();
                  deleteFormData.append("action", "wpsd_delete_widget");
                  deleteFormData.append("security", wpsd_ajax.nonce);
                  deleteFormData.append("widget_id", widget.id);

                  try {
                    const deleteResponse = await fetch(wpsd_ajax.ajax_url, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      body: deleteFormData,
                    });

                    const deleteResult = await deleteResponse.json();
                    if (deleteResult.success) {
                      showToast("Widget deleted!");
                      renderWidgets();
                    } else {
                      showToast(
                        "❌ Failed to delete: " + deleteResult.data.message
                      );
                    }
                  } catch (error) {
                    console.error("Failed to delete widget:", error);
                    showToast(
                      "❌ Failed to delete widget. Check console for details."
                    );
                  }
                });
              });
            }
          });
        } else {
          // If the request was successful but no widgets were found, display a message.
          const emptyRow = document.createElement("tr");
          emptyRow.id = "wpsd-no-widgets-row";
          emptyRow.innerHTML =
            '<td colspan="4" style="text-align:center;">No widgets found! Create a new widget.</td>';
          widgetsList.appendChild(emptyRow);
        }
      }
    } catch (error) {
      console.error("Failed to fetch widgets:", error);
      // You can call your showToast function here to notify the user.
      showToast("❌ Failed to fetch widgets. Check console for details.");
    }
  }

  // --- CREATE WIDGET FORM SUBMIT ---
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const widgetName =
        document.getElementById("wpsd-widget-name").value || "Untitled Widget";

      // Use fetch API instead of jQuery
      const createFormData = new URLSearchParams();
      createFormData.append("action", "wpsd_create_widget");
      createFormData.append("security", wpsd_ajax.nonce);
      createFormData.append("user_name", "admin");
      createFormData.append("widget_name", widgetName);
      createFormData.append("style", "default");

      try {
        const response = await fetch(wpsd_ajax.ajax_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: createFormData,
        });

        const result = await response.json();
        if (result.success) {
          showToast("🎉 Widget created with ID " + result.data.id);
          renderWidgets(); // refresh list from DB
        } else {
          showToast("❌ Failed: " + result.data.message);
        }
      } catch (error) {
        console.error("Failed to create widget:", error);
        showToast("❌ Failed to create widget. Check console for details.");
      }

      if (overlay) overlay.style.display = "none";
      form.reset();
      document.getElementById("wpsd-widget-name").value = "Untitled Widget";
    });
  }

  // Initial load
  renderWidgets();

  // Modal logic
  if (addBtn) {
    addBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (overlay) overlay.style.display = "flex";
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      if (overlay) overlay.style.display = "none";
    });
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      if (overlay) overlay.style.display = "none";
    });
  }
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        overlay.style.display = "none";
      }
    });
  }

  // Toast logic
  function showToast(message) {
    let toast = document.getElementById("wpsd-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "wpsd-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  // --- POPUP HTML ---
  function showPopup(type, widgetName, onConfirm) {
    let popup = document.getElementById("wpsd-action-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "wpsd-action-popup";
      popup.innerHTML = `
      <div class="wpsd-popup-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.2);z-index:999;"></div>
      <div class="wpsd-popup-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:32px 24px;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,0.12);z-index:1000;"></div>
    `;
      document.body.appendChild(popup);
    }
    popup.style.display = "flex";
    popup.style.flexDirection = "column";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "center";

    const content = popup.querySelector(".wpsd-popup-content");
    if (type === "edit") {
      content.innerHTML = `
      <h3 style="margin-bottom:18px;">Edit Widget</h3>
      <label style="font-weight:500;">Widget Name</label>
      <input type="text" id="wpsd-edit-name" value="${widgetName}" style="width:100%;margin-bottom:24px;padding:10px 16px;border-radius:8px;border:1px solid #E5E7EB;">
      <div style="display:flex;justify-content:flex-end;gap:12px;">
        <button id="wpsd-popup-cancel" class="button" style="background:#F3F4F6;color:#374151;">Cancel</button>
        <button id="wpsd-popup-confirm" class="button button-primary">Save</button>
      </div>
    `;
      content.querySelector("#wpsd-popup-cancel").onclick = () =>
        (popup.style.display = "none");
      content.querySelector("#wpsd-popup-confirm").onclick = () => {
        const newName = content.querySelector("#wpsd-edit-name").value;
        popup.style.display = "none";
        onConfirm(newName);
      };
    } else if (type === "delete") {
      content.innerHTML = `
      <h3 style="margin-bottom:18px;">Delete Widget</h3>
      <p style="margin-bottom:24px;">Are you sure you want to delete <b>${widgetName}</b>?</p>
      <div style="display:flex;justify-content:flex-end;gap:12px;">
        <button id="wpsd-popup-cancel" class="button" style="background:#F3F4F6;color:#374151;">Cancel</button>
        <button id="wpsd-popup-confirm" class="button button-primary" style="background:#E24D4D;">Delete</button>
      </div>
    `;
      content.querySelector("#wpsd-popup-cancel").onclick = () =>
        (popup.style.display = "none");
      content.querySelector("#wpsd-popup-confirm").onclick = () => {
        popup.style.display = "none";
        onConfirm();
      };
    }
    popup.querySelector(".wpsd-popup-bg").onclick = () =>
      (popup.style.display = "none");
  }

  /**
   * Close tooltip menus when clicking outside
   */
  document.addEventListener("click", function (e) {
    const tooltips = document.querySelectorAll(".wpsd-tooltip-menu");
    tooltips.forEach((tooltip) => {
      if (!tooltip.contains(e.target) && !e.target.closest(".wpsd-dots")) {
        if (tooltip.classList.contains("active")) {
          tooltip.classList.remove("active");
        }
      }
    });
  });

  // ======================================================================
  // All channels management logic
  // ======================================================================

  // Map of channel data to dynamically update the form
  const channelMap = {
    instagram: {
      title: "Instagram",
      icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
      fieldLabel: "Username",
      fieldPlaceholder: "e.g. your_instagram_handle",
    },
    messenger: {
      title: "Messenger",
      icon: "https://cdn-icons-png.flaticon.com/512/2111/2111624.png",
      fieldLabel: "Username",
      fieldPlaceholder: "e.g. your_facebook_username",
    },
    twitter: {
      title: "Twitter",
      icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
      fieldLabel: "Twitter User ID",
      fieldPlaceholder: "e.g. @your_twitter_id",
    },
    youtube: {
      title: "YouTube",
      icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
      fieldLabel: "Channel URL",
      fieldPlaceholder: "e.g. https://www.youtube.com/channel/...",
    },
    linkedin: {
      title: "LinkedIn",
      icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
      fieldLabel: "Profile Link",
      fieldPlaceholder: "e.g. https://www.linkedin.com/in/...",
    },
    call: {
      title: "Call",
      icon: "https://cdn-icons-png.flaticon.com/512/597/597177.png",
      fieldLabel: "Phone Number",
      fieldPlaceholder: "e.g. +1234567890",
    },
    pinterest: {
      title: "Pinterest",
      icon: "https://cdn-icons-png.flaticon.com/512/733/733646.png",
      fieldLabel: "Profile URL",
      fieldPlaceholder: "e.g. https://www.pinterest.com/...",
    },
    whatsapp: {
      title: "WhatsApp",
      icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
      fieldLabel: "WhatsApp Number",
      fieldPlaceholder: "e.g. +1234567890",
    },
  }; // Get all necessary elements for channel selection modal

  const addChannelBtn = document.querySelector(".wpsd-add-channel-btn");
  const modal = document.getElementById("wpsd-add-channel-modal");
  const modalClose = document.getElementById("wpsd-modal-close");
  const searchInput = document.querySelector("#wpsd-search-input");
  const widgetCards = document.querySelectorAll(".wpsd-widget-card");
  const backBtn = document.querySelector(".wpsd-nav-back");

  // Get all necessary elements for channel form modal

  const channelFormModal = document.getElementById("wpsd-channel-form-modal");
  const channelFormModalClose = document.querySelector(
    ".wpsd-channel-form-close-btn"
  );
  const channelFormModalBack = document.querySelector(
    ".wpsd-channel-form-back-btn"
  );
  const channelFormHeaderTitle = document.querySelector(
    "#wpsd-channel-form-modal .wpsd-channel-form-header-title"
  );
  const channelIconPreview = document.getElementById(
    "wpsd-channel-icon-preview"
  );

  //----------------------------
  const logicalInputLabel = document.getElementById("wpsd-logical-input-label");
  const logicalInput = document.getElementById("wpsd-logical-input");
  const messageInputGroup = document.getElementById("wpsd-message-input-group");
  const imageUploadBtn = document.getElementById("wpsd-image-upload-btn");
  const imageUploadInput = document.getElementById("wpsd-image-upload-input");
  const channelSaveBtn = document.querySelector(".wpsd-channel-save-btn"); // Global variable to store the selected channel type

  //new code started
  // Global variables
  let selectedChannelType = null;
  // const urlParams = new URLSearchParams(window.location.search);
  // const widgetId = urlParams.get("widget_id");
  // const channelListContainer = document.querySelector(
  //   ".wpsd-channels-list-wrap"
  // );

  /**
   * Fetches and renders channels for a specific widget ID.
   * This function will replace the old mock logic to display a correct list.
   */

  // This assumes you have a <div class="wpsd-channels-list-wrap"></div> in your HTML
  // and the static text "Create new channel from here." is already present above it.

  const channelListContainer = document.querySelector(
    ".wpsd-channels-list-wrap"
  );
  const urlParams = new URLSearchParams(window.location.search);
  let widgetId = urlParams.get("widget_id");
  widgetId = widgetId && !isNaN(widgetId) ? Number(widgetId) : null;

  // Channel type map for icons/titles (should match your PHP/DB config)
  // const channelMap = {
  //   instagram: {
  //     title: "Instagram",
  //     icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
  //   },
  //   messenger: {
  //     title: "Messenger",
  //     icon: "https://cdn-icons-png.flaticon.com/512/2111/2111624.png",
  //   },
  //   twitter: {
  //     title: "Twitter",
  //     icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
  //   },
  //   youtube: {
  //     title: "YouTube",
  //     icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
  //   },
  //   linkedin: {
  //     title: "LinkedIn",
  //     icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
  //   },
  //   call: {
  //     title: "Call",
  //     icon: "https://cdn-icons-png.flaticon.com/512/597/597177.png",
  //   },
  //   pinterest: {
  //     title: "Pinterest",
  //     icon: "https://cdn-icons-png.flaticon.com/512/733/733646.png",
  //   },
  //   whatsapp: {
  //     title: "WhatsApp",
  //     icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
  //   },
  // };

  // ... (your existing JavaScript code) ...

  function renderChannels(widgetId) {
    const channelListWrap = document.querySelector(".wpsd-channels-list-wrap");
    const noChannelsMessage = document.querySelector(
      '.wpsd-channels-create-wrap div[style*="Create new channel"]'
    );

    if (!channelListWrap) {
      console.error("Channel list container not found.");
      return;
    }

    // Clear existing channels and show loading state
    channelListWrap.innerHTML = "<p>Loading channels...</p>";

    // Show the "Create new channel" message by default
    if (noChannelsMessage) {
      noChannelsMessage.style.display = "block";
    }

    // Use URLSearchParams to build the form-data payload
    const formData = new URLSearchParams();
    formData.append("action", "wpsd_get_channels");
    formData.append("security", wpsd_ajax.nonce);
    formData.append("widget_id", widgetId ? widgetId : "");

    fetch(wpsd_ajax.ajax_url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // Check if the response is ok (status 200)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        console.log("Channels response:", response);

        if (response.success) {
          const channels = response.data.channels;
          console.log("Channels from database:", channels); // Added console.log for debugging
          if (channels.length > 0) {
            // Channels exist, hide the "Create new channel" message
            if (noChannelsMessage) {
              noChannelsMessage.style.display = "none";
            }
            channelListWrap.innerHTML = ""; // Clear loading message

            channels.forEach((channel) => {
              // Fallback icon and title if config is null
              let icon = channelMap[channel.channel_name]?.icon || "";
              let title =
                channelMap[channel.channel_name]?.title || channel.channel_name;

              const card = document.createElement("div");
              card.className = "wpsd-channel-card";
              card.style.cssText =
                "display:flex;align-items:center;justify-content:space-between;padding:18px 24px;background:#fff;border-radius:12px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.04);font-size:1.1rem;";
              card.innerHTML = `
                <div style="display:flex;align-items:center;gap:16px;">
                  <span style="font-size:1.5rem;cursor:grab;color:#9ca3af;">&#8942;</span>
                  <img src="${icon}" alt="${title} Icon" style="width:32px;height:32px;border-radius:50%;background:#f3f4f6;">
                  <span style="font-weight:500;color:#374151;">${title}</span>
                </div>
                <div style="display:flex;align-items:center;gap:18px;">
                  <button style="background:none;border:none;cursor:pointer;color:#374151;font-size:1rem;display:flex;align-items:center;gap:4px;"><span style="font-size:1.1rem;">&#9998;</span> Edit</button>
                  <button style="background:none;border:none;cursor:pointer;color:#374151;font-size:1rem;display:flex;align-items:center;gap:4px;"><span style="font-size:1.1rem;">&#128203;</span> Duplicate</button>
                  <button style="background:none;border:none;cursor:pointer;color:#ef4444;font-size:1rem;display:flex;align-items:center;gap:4px;"><span style="font-size:1.1rem;">&#128465;</span> Delete</button>
                </div>
              `;
              channelListWrap.appendChild(card);
            });
          } else {
            // No channels found, show the "Create new channel" message
            if (noChannelsMessage) {
              noChannelsMessage.style.display = "block";
            }
            channelListWrap.innerHTML = ""; // Clear loading message
          }
        } else {
          // Backend returned an error
          console.error("Error fetching channels:", response.data.message);
          if (noChannelsMessage) {
            noChannelsMessage.style.display = "block";
          }
          channelListWrap.innerHTML = ""; // Clear loading message
        }
      })
      .catch((error) => {
        // Network error or fetch() failure
        console.error("AJAX Error:", error);
        if (noChannelsMessage) {
          noChannelsMessage.style.display = "block";
        }
        channelListWrap.innerHTML = ""; // Clear loading message
      });
  }

  // Initial render: only call if widgetId is a valid positive number
  if (widgetId && widgetId > 0) {
    renderChannels(widgetId);
  }

  // --- Event listeners for channels ---
  // Modal open for adding a new channel
  if (addChannelBtn && modal) {
    addChannelBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  // Modal close for adding a new channel
  if (modalClose && modal) {
    modalClose.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // --- NAV BACK BUTTON ---
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "admin.php?page=wpsd_all_widgets";
    });
  }

  // 🔍 Search filter
  if (searchInput && widgetCards.length > 0) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.trim().toLowerCase();
      widgetCards.forEach((card) => {
        const label = card
          .querySelector("div")
          .textContent.trim()
          .toLowerCase();
        card.style.display =
          val === "" || label.includes(val) ? "flex" : "none";
      });
    });
  }

  // Show the channel form modal when a widget is clicked

  if (widgetCards.length > 0) {
    widgetCards.forEach((card) => {
      card.addEventListener("click", () => {
        // Store the selected channel type in our global variable
        selectedChannelType = card.dataset.channel;
        const widgetName =
          selectedChannelType.charAt(0).toUpperCase() +
          selectedChannelType.slice(1);
        const channelData = channelMap[selectedChannelType];

        if (channelData) {
          channelFormHeaderTitle.textContent = channelData.title;
          channelIconPreview.src = channelData.icon;
          logicalInputLabel.textContent = channelData.fieldLabel;
          logicalInput.placeholder = channelData.fieldPlaceholder;
          const channelTitleInput =
            document.getElementById("wpsd-channel-title");
          if (channelTitleInput) {
            channelTitleInput.value = widgetName;
          }
          messageInputGroup.style.display =
            selectedChannelType === "whatsapp" ? "block" : "none";
          if (modal) {
            modal.style.display = "none";
          }
          if (channelFormModal) {
            channelFormModal.style.display = "flex";
          }
        }
      });
    });
  }

  // Hide the channel form modal with the close button
  if (channelFormModalClose && channelFormModal) {
    channelFormModalClose.addEventListener("click", () => {
      channelFormModal.style.display = "none";
    });
  }

  // Hide the channel form modal with the back button and show the selection modal
  if (channelFormModalBack && channelFormModal && modal) {
    channelFormModalBack.addEventListener("click", () => {
      channelFormModal.style.display = "none";
      modal.style.display = "flex";
    });
  }

  // Handle file upload button click
  if (imageUploadBtn && imageUploadInput) {
    imageUploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      imageUploadInput.click();
    });
  }

  // Handle image preview on file selection
  if (imageUploadInput && channelIconPreview) {
    imageUploadInput.addEventListener("change", () => {
      const file = imageUploadInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          channelIconPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Handle Save button click

  // Handle Save button click
  if (channelSaveBtn) {
    channelSaveBtn.addEventListener("click", async () => {
      // Add loading state to the button
      const originalButtonHtml = channelSaveBtn.innerHTML;
      channelSaveBtn.disabled = true;
      channelSaveBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
      `;

      try {
        if (!selectedChannelType || !widgetId) {
          console.error("Missing channel type or widget ID.");
          return;
        }

        // Create the channel_show_on array based on checkboxes
        const channelShowOn = [];
        if (document.getElementById("wpsd-show-desktop").checked) {
          channelShowOn.push("desktop");
        }
        if (document.getElementById("wpsd-show-mobile").checked) {
          channelShowOn.push("mobile");
        }

        const channelData = {
          channel_show_on: channelShowOn,
          f_fields: {
            logical_input: document.getElementById("wpsd-logical-input").value,
            message: document.getElementById("wpsd-message-input").value,
          },
          title: document.getElementById("wpsd-channel-title").value,
          icon: document.getElementById("wpsd-channel-icon-preview").src,
          target: document.getElementById("wpsd-target-select").value,
          hide_after_office_hours: document.getElementById(
            "wpsd-office-hours-toggle"
          ).checked,
        };

        const channelFormData = new FormData();
        channelFormData.append("action", "wpsd_save_channel");
        channelFormData.append("widget_id", widgetId); // Use the URL widget ID
        channelFormData.append("channel_name", selectedChannelType);
        channelFormData.append("config", JSON.stringify(channelData));
        channelFormData.append("security", wpsd_ajax.nonce);

        const channelResponse = await fetch(wpsd_ajax.ajax_url, {
          method: "POST",
          body: channelFormData,
        });

        const channelResult = await channelResponse.json();
        console.log("Channel save response:", channelResult);

        if (channelResult.success) {
          console.log("Channel saved successfully!");
          if (channelFormModal) {
            channelFormModal.style.display = "none";
            // Re-render the channel list after a successful save
            renderChannels();
          }
        } else {
          console.error("Failed to save channel:", channelResult.data.message);
        }
      } catch (error) {
        console.error("AJAX Error:", error);
      } finally {
        channelSaveBtn.disabled = false;
        channelSaveBtn.innerHTML = originalButtonHtml;
      }
    });
  }

  // Initial load: Render channels if a widget_id exists in the URL
  if (widgetId) {
    renderChannels();
  }
});

// channelSaveBtn.addEventListener("click", async () => {
//   const loader = channelSaveBtn.querySelector(".wpsd-loader");
//   const saveText = channelSaveBtn.querySelector(".wpsd-save-text");
//   loader.style.display = "inline-block";
//   saveText.textContent = "Saving...";

//   console.log("Save button clicked. Starting two-step save process.");

//   if (!selectedChannelType) {
//     console.error("No channel type selected. Please select a channel.");
//     return;
//   }

// Add loading state to the button
// const originalButtonHtml = channelSaveBtn.innerHTML;
// channelSaveBtn.disabled = true;
// channelSaveBtn.innerHTML = `
//       <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//           <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1-7 7V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//       </svg>
//       Saving...
//   `;

//       try {
//         // 🔹 Step 1: Create the widget
//         const widgetFormData = new FormData();
//         widgetFormData.append("action", "wpsd_create_widget");
//         widgetFormData.append("user_name", "Admin"); // Or a dynamic user name
//         widgetFormData.append(
//           "widget_name",
//           document.getElementById("wpsd-channel-title").value
//         );
//         widgetFormData.append("style", "default_style"); // Or a dynamic style
//         widgetFormData.append("security", wpsd_ajax.nonce);

//         const widgetResponse = await fetch(wpsd_ajax.ajax_url, {
//           method: "POST",
//           body: widgetFormData,
//         });

//         const widgetResult = await widgetResponse.json();
//         console.log("Widget creation response:", widgetResult);

//         if (!widgetResult.success) {
//           console.error("Failed to create widget:", widgetResult.data.message);
//           return;
//         }

//         const newWidgetId = widgetResult.data.id;
//         console.log("Widget created successfully with ID:", newWidgetId); // 🔹 Step 2: Save the channel with the new widget ID // Create the channel_show_on array based on checkboxes

//         const channelShowOn = [];
//         if (document.getElementById("wpsd-show-desktop").checked) {
//           channelShowOn.push("desktop");
//         }
//         if (document.getElementById("wpsd-show-mobile").checked) {
//           channelShowOn.push("mobile");
//         }

//         const channelData = {
//           // A new field to specify where the channel should be shown
//           channel_show_on: channelShowOn,
//           // I edited the code: Removed the hardcoded 'sequence' key. The PHP will now handle it.
//           // F_fields to hold the primary input for the channel
//           f_fields: {
//             logical_input: document.getElementById("wpsd-logical-input").value,
//             message: document.getElementById("wpsd-message-input").value,
//           },
//           title: document.getElementById("wpsd-channel-title")
//             ? document.getElementById("wpsd-channel-title").value
//             : channelMap[selectedChannelType].title,
//           icon: document.getElementById("wpsd-channel-icon-preview").src,
//           target: document.getElementById("wpsd-target-select").value,
//           hide_after_office_hours: document.getElementById(
//             "wpsd-office-hours-toggle"
//           ).checked,
//           // Remove the individual booleans since they are now in the channel_show_on array
//         };

//         const channelFormData = new FormData();
//         channelFormData.append("action", "wpsd_save_channel");
//         channelFormData.append("widget_id", newWidgetId);
//         channelFormData.append("channel_name", selectedChannelType);
//         channelFormData.append("config", JSON.stringify(channelData));
//         channelFormData.append("security", wpsd_ajax.nonce);

//         const channelResponse = await fetch(wpsd_ajax.ajax_url, {
//           method: "POST",
//           body: channelFormData,
//         });

//         const channelResult = await channelResponse.json();
//         console.log("Channel save response:", channelResult);

//         if (channelResult.success) {
//           console.log("Channel saved successfully!");
//           if (channelFormModal) {
//             channelFormModal.style.display = "none";
//             // I edited the code: Replaced the browser reload with a message to the console.
//             console.log(
//               "Channel successfully created. The channel list needs to be updated."
//             );
//           }
//         } else {
//           console.error("Failed to save channel:", channelResult.data.message);
//         }
//       } catch (error) {
//         console.error("AJAX Error:", error);
//       } finally {
//         // I edited the code: Restored the button state regardless of success or failure.
//         channelSaveBtn.disabled = false;
//         channelSaveBtn.innerHTML = originalButtonHtml;
//         loader.style.display = "none";
//         saveText.textContent = "Save";
//       }
//     });
//   }
// });
