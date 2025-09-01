function renderWidgets() {
  jQuery.post(
    wpsd_ajax.ajax_url,
    {
      action: "wpsd_get_widgets", // You need to implement this PHP handler to fetch all widgets from DB
      security: wpsd_ajax.nonce,
    },
    function (response) {
      widgetsList.innerHTML = "";
      console.log(response);
      if (
        !response.success ||
        !response.data.widgets ||
        response.data.widgets.length === 0
      ) {
        var emptyRow = document.createElement("tr");
        emptyRow.id = "wpsd-no-widgets-row";
        emptyRow.innerHTML =
          '<td colspan="4" style="text-align:center;">No widgets found! Create a new widget.</td>';
        widgetsList.appendChild(emptyRow);
        return;
      }

      response.data.widgets.forEach(function (widget) {
        var tr = document.createElement("tr");
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
                    <button class="wpsd-edit"><span>✏️</span> Edit</button>
                    <button class="wpsd-duplicate"><span>📄</span> Duplicate</button>
                    <button class="wpsd-delete"><span>🗑️</span> Delete</button>
                </div>
            </span>
        </td>
    `;
        widgetsList.appendChild(tr);

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

        // Edit logic
        tooltip
          .querySelector(".wpsd-edit")
          .addEventListener("click", function (e) {
            e.stopPropagation();
            tooltip.classList.remove("active");
            // Pass the correct widget name from the database response
            showPopup("edit", widget.widget_name, function (newName) {
              // AJAX request to update widget name
              jQuery.post(
                wpsd_ajax.ajax_url,
                {
                  action: "wpsd_update_widget", // You need to create this handler in PHP
                  security: wpsd_ajax.nonce,
                  widget_id: widget.id,
                  widget_name: newName,
                },
                function (response) {
                  if (response.success) {
                    showToast("Widget updated!");
                    renderWidgets();
                  } else {
                    showToast("❌ Failed to update: " + response.data.message);
                  }
                }
              );
            });
          });

        // Delete logic
        // Delete logic
        tooltip
          .querySelector(".wpsd-delete")
          .addEventListener("click", function (e) {
            e.stopPropagation();
            tooltip.classList.remove("active");
            // Pass the correct widget name from the database response
            showPopup("delete", widget.widget_name, function () {
              // AJAX request to delete widget
              jQuery.post(
                wpsd_ajax.ajax_url,
                {
                  action: "wpsd_delete_widget", // You need to create this handler in PHP
                  security: wpsd_ajax.nonce,
                  widget_id: widget.id,
                },
                function (response) {
                  if (response.success) {
                    showToast("Widget deleted!");
                    renderWidgets();
                  } else {
                    showToast("❌ Failed to delete: " + response.data.message);
                  }
                }
              );
            });
          });

        // Duplicate logic (AJAX)
        tooltip
          .querySelector(".wpsd-duplicate")
          .addEventListener("click", function (e) {
            e.stopPropagation();
            tooltip.classList.remove("active");

            console.log("[WPSD][Duplicate] Clicked", widget);
            if (!widget || !widget.id) {
              console.error("[WPSD][Duplicate] Missing widget id", widget);
              showToast("❌ Can't duplicate: missing widget id.");
              return;
            }

            console.log("[WPSD][Duplicate] Sending AJAX", {
              url: wpsd_ajax.ajax_url,
              action: "wpsd_duplicate_widget",
              security: wpsd_ajax.nonce,
              widget_id: widget.id,
            });

            jQuery
              .post(
                wpsd_ajax.ajax_url,
                {
                  action: "wpsd_duplicate_widget",
                  security: wpsd_ajax.nonce,
                  widget_id: widget.id,
                },
                function (response) {
                  console.log(
                    "[WPSD][Duplicate] AJAX success response:",
                    response
                  );

                  if (response.success) {
                    showToast(
                      "✅ " +
                        response.data.message +
                        " (New ID: " +
                        response.data.new_id +
                        ")"
                    );
                    renderWidgets(); // refresh widget list
                  } else {
                    showToast(
                      "❌ Failed to duplicate: " + response.data.message
                    );
                  }
                }
              )
              .fail(function (xhr) {
                console.error("[WPSD][Duplicate] AJAX error", {
                  status: xhr.statusText,
                  error: xhr.responseText,
                  xhr: xhr,
                });
                showToast("❌ AJAX request failed.");
              });
          }); //duplicate logic end
      });
    }
  );
}
