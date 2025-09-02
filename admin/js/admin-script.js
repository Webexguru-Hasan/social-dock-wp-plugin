document.addEventListener("DOMContentLoaded", function () {
  // Dark/Light toggle
  var toggleBtn = document.getElementById("wpsd-dark-toggle");
  var toggleIcon = document.getElementById("wpsd-toggle-icon");
  var darkMode = localStorage.getItem("wpsd-dark") === "true";
  function setDarkMode(on) {
    document.body.classList.toggle("wpsd-dark", on);
    toggleIcon.innerHTML = on ? "&#9728;" : "&#9790;";
    localStorage.setItem("wpsd-dark", on ? "true" : "false");
  }
  setDarkMode(darkMode);
  toggleBtn.addEventListener("click", function () {
    darkMode = !darkMode;
    setDarkMode(darkMode);
  });

  // Widget logic
  var addBtn = document.getElementById("wpsd-add-widget-btn");
  var overlay = document.getElementById("wpsd-modal-overlay");
  var closeBtn = document.getElementById("wpsd-modal-close");
  var cancelBtn = document.getElementById("wpsd-modal-cancel");
  var form = document.getElementById("wpsd-create-widget-form");
  var widgetsList = document.getElementById("wpsd-widgets-list");
  var noWidgetsRow = document.getElementById("wpsd-no-widgets-row");

  /**
   * Asynchronously fetches widgets from the server using the native fetch API
   * and renders them to the page. This is the vanilla JavaScript equivalent
   * of the jQuery.post() call.
   */
  async function renderWidgets() {
    console.log("Fetching widgets...");

    // Construct the data to be sent, including the action and security nonce.
    // URLSearchParams is the standard way to format data for POST requests in vanilla JS.
    const formData = new URLSearchParams();
    formData.append("action", "wpsd_get_widgets");
    formData.append("security", wpsd_ajax.nonce);

    try {
      // Use the fetch API to make a POST request to the WordPress AJAX URL.
      const response = await fetch(wpsd_ajax.ajax_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      // Check if the response was successful.
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the JSON data from the response.
      const result = await response.json();

      const widgetsList = document.getElementById("wpsd-widgets-list");

      // Clear the existing list before rendering.
      if (widgetsList) {
        widgetsList.innerHTML = "";

        // Check if the request was successful and if there are widgets to display.
        if (
          result.success &&
          result.data &&
          result.data.widgets &&
          result.data.widgets.length > 0
        ) {
          // Render each widget to the list.
          result.data.widgets.forEach(function (widget) {
            var tr = document.createElement("tr");
            tr.className = "wpsd-widget-row";
            tr.innerHTML = `
                        <td>
                            <label class="wpsd-switch">
                                <input type="checkbox" ${
                                  widget.status == 1 ? "checked" : ""
                                }>
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
            var widgetNameCell = tr.querySelector(".wpsd-widget-name");
            widgetNameCell.addEventListener("click", function () {
              window.location.href = `admin.php?page=wpsd_all_channels&widget_id=${widget.id}`;
            });

            // Prevent propagation from children elements that should not trigger redirect
            var switchInput = tr.querySelector(".wpsd-switch input");
            var siteButton = tr.querySelector(".wpsd-widget-site");
            var actionsSpan = tr.querySelector(".wpsd-widget-actions");
            var tooltipMenu = tr.querySelector(".wpsd-tooltip-menu");
            var tooltipButtons = tooltipMenu
              ? tooltipMenu.querySelectorAll("button")
              : [];

            switchInput.addEventListener("click", function (e) {
              e.stopPropagation();
            });
            siteButton.addEventListener("click", function (e) {
              e.stopPropagation();
            });
            actionsSpan.addEventListener("click", function (e) {
              e.stopPropagation();
            });
            tooltipButtons.forEach(function (btn) {
              btn.addEventListener("click", function (e) {
                e.stopPropagation();
              });
            });

            // Tooltip logic
            var dots = tr.querySelector(".wpsd-dots");
            var tooltip = tr.querySelector(".wpsd-tooltip-menu");
            dots.addEventListener("click", function (e) {
              e.stopPropagation();
              document
                .querySelectorAll(".wpsd-tooltip-menu")
                .forEach((t) => t.classList.remove("active"));
              tooltip.classList.toggle("active");
            });

            // Edit logic using fetch API
            var editButton = tooltip.querySelector(".wpsd-edit");
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

            // Duplicate logic using fetch API
            var duplicateButton = tooltip.querySelector(".wpsd-duplicate");
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

            // Delete logic using fetch API
            var deleteButton = tooltip.querySelector(".wpsd-delete");
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
          });
        } else {
          // If the request was successful but no widgets were found, display a message.
          var emptyRow = document.createElement("tr");
          emptyRow.id = "wpsd-no-widgets-row";
          emptyRow.innerHTML =
            '<td colspan="4" style="text-align:center;">No widgets found! Create a new widget.</td>';
          widgetsList.appendChild(emptyRow);
        }
      }
    } catch (error) {
      console.error("Failed to fetch widgets:", error);
      // You would call your showToast function here to notify the user.
      // showToast("❌ Failed to fetch widgets. Check console for details.");
    }
  }

  // --- CREATE WIDGET FORM SUBMIT ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var widgetName =
      document.getElementById("wpsd-widget-name").value || "Untitled Widget";

    // AJAX request to PHP
    jQuery.post(
      wpsd_ajax.ajax_url,
      {
        action: "wpsd_create_widget",
        security: wpsd_ajax.nonce,
        user_name: "admin", // you can dynamically fetch logged-in user later
        widget_name: widgetName,
        style: "default", // you can pass style selector later
      },
      function (response) {
        if (response.success) {
          showToast("🎉 Widget created with ID " + response.data.id);
          renderWidgets(); // refresh list from DB
        } else {
          showToast("❌ Failed: " + response.data.message);
        }
      }
    );

    overlay.style.display = "none";
    form.reset();
    document.getElementById("wpsd-widget-name").value = "Untitled Widget";
  });

  // Initial load
  renderWidgets();

  // Modal logic
  addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    overlay.style.display = "flex"; // or "block" if your CSS uses block
  });
  closeBtn.addEventListener("click", function () {
    overlay.style.display = "none";
  });
  cancelBtn.addEventListener("click", function () {
    overlay.style.display = "none";
  });
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) overlay.style.display = "none";
  });

  //Toast logic
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
    let content = popup.querySelector(".wpsd-popup-content");
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
        let newName = content.querySelector("#wpsd-edit-name").value;
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
    // Select all tooltip menus
    const tooltips = document.querySelectorAll(".wpsd-tooltip-menu");

    // Loop through each tooltip to check if the click was inside or outside
    tooltips.forEach((tooltip) => {
      // Check if the clicked element is not a tooltip or a dots button
      if (!tooltip.contains(e.target) && !e.target.closest(".wpsd-dots")) {
        // If the tooltip is active, remove the 'active' class
        if (tooltip.classList.contains("active")) {
          tooltip.classList.remove("active");
        }
      }
    });
  });
}); // Social Dock Admin Scripts
// Move all your <script> content here.
