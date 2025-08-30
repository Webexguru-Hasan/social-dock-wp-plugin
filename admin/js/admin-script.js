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

  // LocalStorage DB functions
  function getWidgetsFromStorage() {
    try {
      return JSON.parse(localStorage.getItem("wpsd_widgets") || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveWidgetsToStorage(widgets) {
    localStorage.setItem("wpsd_widgets", JSON.stringify(widgets));
  }
  function addWidgetToStorage(widget) {
    var widgets = getWidgetsFromStorage();
    widgets.push(widget);
    saveWidgetsToStorage(widgets);
  }
  function updateWidgetInStorage(index, widget) {
    var widgets = getWidgetsFromStorage();
    widgets[index] = widget;
    saveWidgetsToStorage(widgets);
  }
  function deleteWidgetFromStorage(index) {
    var widgets = getWidgetsFromStorage();
    widgets.splice(index, 1);
    saveWidgetsToStorage(widgets);
  }

  // Render widgets from storage
  function renderWidgets() {
    widgetsList.innerHTML = "";
    var widgets = getWidgetsFromStorage();
    if (widgets.length === 0) {
      var emptyRow = document.createElement("tr");
      emptyRow.id = "wpsd-no-widgets-row";
      emptyRow.innerHTML =
        '<td colspan="4" style="text-align:center;">No widgets found! Create a new widget.</td>';
      widgetsList.appendChild(emptyRow);
      return;
    }
    widgets.forEach(function (widget, idx) {
      var tr = document.createElement("tr");
      tr.className = "wpsd-widget-row";
      tr.innerHTML = `
                        <td>
                            <label class="wpsd-switch">
                                <input type="checkbox" ${
                                  widget.status ? "checked" : ""
                                }>
                                <span class="wpsd-slider"></span>
                            </label>
                        </td>
                        <td class="wpsd-widget-name">${widget.name}</td>
                        <td class="wpsd-widget-date">${widget.date}</td>
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
          showPopup("edit", widget.name, function (newName) {
            widget.name = newName;
            updateWidgetInStorage(idx, widget);
            renderWidgets();
            showToast("Widget updated!");
          });
        });

      // Duplicate logic
      tooltip
        .querySelector(".wpsd-duplicate")
        .addEventListener("click", function (e) {
          e.stopPropagation();
          tooltip.classList.remove("active");
          var newWidget = Object.assign({}, widget);
          newWidget.name = widget.name + " Copy";
          addWidgetToStorage(newWidget);
          renderWidgets();
          showToast("Widget duplicated!");
        });

      // Delete logic
      tooltip
        .querySelector(".wpsd-delete")
        .addEventListener("click", function (e) {
          e.stopPropagation();
          tooltip.classList.remove("active");
          showPopup("delete", widget.name, function () {
            deleteWidgetFromStorage(idx);
            renderWidgets();
            showToast("Widget deleted!");
          });
        });

      // Status toggle logic
      tr.querySelector(".wpsd-switch input").addEventListener(
        "change",
        function (e) {
          widget.status = this.checked;
          updateWidgetInStorage(idx, widget);
        }
      );
    });
  }

  // Initial render
  renderWidgets();

  addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    overlay.style.display = "flex";
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
                        <div class="wpsd-popup-bg"></div>
                        <div class="wpsd-popup-content"></div>
                    `;
      document.body.appendChild(popup);
    }
    popup.style.display = "flex";
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

  // --- WIDGET ROW LOGIC ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var widgetName =
      document.getElementById("wpsd-widget-name").value || "Untitled Widget";
    var today = new Date();
    var dateStr = today.toLocaleDateString("en-GB"); // DD/MM/YYYY

    var widget = {
      name: widgetName,
      date: dateStr,
      status: true,
    };
    addWidgetToStorage(widget);
    renderWidgets();

    overlay.style.display = "none";
    form.reset();
    document.getElementById("wpsd-widget-name").value = "Untitled Widget";
  });
}); // Social Dock Admin Scripts
// Move all your <script> content here.
