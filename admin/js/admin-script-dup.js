// document.addEventListener("DOMContentLoaded", () => {
//   // Map of channel data to dynamically update the form
//   const channelMap = {
//     instagram: {
//       title: "Instagram",
//       icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
//       fieldLabel: "Username",
//       fieldPlaceholder: "e.g. your_instagram_handle",
//     },
//     messenger: {
//       title: "Messenger",
//       icon: "https://cdn-icons-png.flaticon.com/512/2111/2111624.png",
//       fieldLabel: "Username",
//       fieldPlaceholder: "e.g. your_facebook_username",
//     },
//     twitter: {
//       title: "Twitter",
//       icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
//       fieldLabel: "Twitter User ID",
//       fieldPlaceholder: "e.g. @your_twitter_id",
//     },
//     youtube: {
//       title: "YouTube",
//       icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
//       fieldLabel: "Channel URL",
//       fieldPlaceholder: "e.g. https://www.youtube.com/channel/...",
//     },
//     linkedin: {
//       title: "LinkedIn",
//       icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
//       fieldLabel: "Profile Link",
//       fieldPlaceholder: "e.g. https://www.linkedin.com/in/...",
//     },
//     call: {
//       title: "Call",
//       icon: "https://cdn-icons-png.flaticon.com/512/597/597177.png",
//       fieldLabel: "Phone Number",
//       fieldPlaceholder: "e.g. +1234567890",
//     },
//     pinterest: {
//       title: "Pinterest",
//       icon: "https://cdn-icons-png.flaticon.com/512/733/733646.png",
//       fieldLabel: "Profile URL",
//       fieldPlaceholder: "e.g. https://www.pinterest.com/...",
//     },
//     whatsapp: {
//       title: "WhatsApp",
//       icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
//       fieldLabel: "WhatsApp Number",
//       fieldPlaceholder: "e.g. +1234567890",
//     },
//   };

//   // Get all necessary elements for channel selection modal
//   const addChannelBtn = document.querySelector(".wpsd-add-channel-btn");
//   const modal = document.getElementById("wpsd-add-channel-modal");
//   const modalClose = document.getElementById("wpsd-modal-close");
//   const searchInput = document.querySelector("#wpsd-search-input");
//   const widgetCards = document.querySelectorAll(".wpsd-widget-card");
//   const backBtn = document.querySelector(".wpsd-nav-back");

//   // Get all necessary elements for channel form modal
//   const channelFormModal = document.getElementById("wpsd-channel-form-modal");
//   const channelFormModalClose = document.querySelector(
//     ".wpsd-channel-form-close-btn"
//   );
//   const channelFormModalBack = document.querySelector(
//     ".wpsd-channel-form-back-btn"
//   );
//   const channelFormHeaderTitle = document.querySelector(
//     "#wpsd-channel-form-modal .wpsd-channel-form-header-title"
//   );
//   const channelIconPreview = document.getElementById(
//     "wpsd-channel-icon-preview"
//   );
//   const logicalInputLabel = document.getElementById("wpsd-logical-input-label");
//   const logicalInput = document.getElementById("wpsd-logical-input");
//   const messageInputGroup = document.getElementById("wpsd-message-input-group");
//   const imageUploadBtn = document.getElementById("wpsd-image-upload-btn");
//   const imageUploadInput = document.getElementById("wpsd-image-upload-input");
//   const channelSaveBtn = document.querySelector(".wpsd-channel-save-btn");

//   // Modal open for adding a new channel
//   if (addChannelBtn && modal) {
//     addChannelBtn.addEventListener("click", () => {
//       modal.style.display = "flex";
//     });
//   }

//   // Modal close for adding a new channel
//   if (modalClose && modal) {
//     modalClose.addEventListener("click", () => {
//       modal.style.display = "none";
//     });
//   }

//   // --- NAV BACK BUTTON ---
//   if (backBtn) {
//     backBtn.addEventListener("click", () => {
//       window.location.href = "admin.php?page=wpsd_all_widgets";
//     });
//   }

//   // 🔍 Search filter
//   if (searchInput && widgetCards.length > 0) {
//     searchInput.addEventListener("input", (e) => {
//       const val = e.target.value.trim().toLowerCase();
//       widgetCards.forEach((card) => {
//         const label = card
//           .querySelector("div")
//           .textContent.trim()
//           .toLowerCase();
//         card.style.display =
//           val === "" || label.includes(val) ? "flex" : "none";
//       });
//     });
//   }

//   // Show the channel form modal when a widget is clicked
//   if (widgetCards.length > 0) {
//     widgetCards.forEach((card) => {
//       card.addEventListener("click", () => {
//         const channelType = card.dataset.channel;
//         const channelData = channelMap[channelType];

//         if (channelData) {
//           channelFormHeaderTitle.textContent = channelData.title;
//           channelIconPreview.src = channelData.icon;
//           logicalInputLabel.textContent = channelData.fieldLabel;
//           logicalInput.placeholder = channelData.fieldPlaceholder;

//           messageInputGroup.style.display =
//             channelType === "whatsapp" ? "block" : "none";

//           if (modal) {
//             modal.style.display = "none";
//           }
//           if (channelFormModal) {
//             channelFormModal.style.display = "flex";
//           }
//         }
//       });
//     });
//   }

//   // Hide the channel form modal with the close button
//   if (channelFormModalClose && channelFormModal) {
//     channelFormModalClose.addEventListener("click", () => {
//       channelFormModal.style.display = "none";
//     });
//   }

//   // Hide the channel form modal with the back button and show the selection modal
//   if (channelFormModalBack && channelFormModal && modal) {
//     channelFormModalBack.addEventListener("click", () => {
//       channelFormModal.style.display = "none";
//       modal.style.display = "flex";
//     });
//   }

//   // Handle file upload button click
//   if (imageUploadBtn && imageUploadInput) {
//     imageUploadBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       imageUploadInput.click();
//     });
//   }

//   // Handle image preview on file selection
//   if (imageUploadInput && channelIconPreview) {
//     imageUploadInput.addEventListener("change", () => {
//       const file = imageUploadInput.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           channelIconPreview.src = e.target.result;
//         };
//         reader.readAsDataURL(file);
//       }
//     });
//   }

//   // Handle Save button click (placeholder for future CRUD)
//   if (channelSaveBtn) {
//     channelSaveBtn.addEventListener("click", () => {
//       console.log("Save button clicked. Preparing to send data via AJAX.");

//       const channelType = document.querySelector(
//         ".wpsd-widget-card[data-channel]"
//       ).dataset.channel;
//       const channelData = {
//         title: document.getElementById("wpsd-channel-title")
//           ? document.getElementById("wpsd-channel-title").value
//           : channelMap[channelType].title,
//         icon: document.getElementById("wpsd-channel-icon-preview").src,
//         logical_input: document.getElementById("wpsd-logical-input").value,
//         message: document.getElementById("wpsd-message-input").value,
//         target: document.getElementById("wpsd-target-select").value,
//         hide_after_office_hours: document.getElementById(
//           "wpsd-office-hours-toggle"
//         ).checked,
//         show_on_desktop: document.getElementById("wpsd-show-desktop").checked,
//         show_on_mobile: document.getElementById("wpsd-show-mobile").checked,
//       };

//       const formData = new FormData();
//       formData.append("action", "wpsd_create_channel");
//       formData.append("channel_name", channelType);
//       formData.append("config", JSON.stringify(channelData));
//       // NOTE: You must replace 'YOUR_WIDGET_ID' and 'YOUR_NONCE_VALUE' with the actual values from your PHP
//       // For example: formData.append('widget_id', '<?php echo esc_attr($widget_id); ?>');
//       // For example: formData.append('security', '<?php echo wp_create_nonce("wpsd_nonce"); ?>');
//       formData.append("widget_id", "YOUR_WIDGET_ID");
//       formData.append("security", "YOUR_NONCE_VALUE");

//       fetch(ajaxurl, {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((result) => {
//           console.log("Server response:", result);
//           if (result.success) {
//             console.log("Channel created successfully!");
//             // Add your success handling here (e.g., close modal, show message)
//             if (channelFormModal) {
//               channelFormModal.style.display = "none";
//             }
//           } else {
//             console.error("Failed to create channel:", result.data.message);
//             // Add your error handling here
//           }
//         })
//         .catch((error) => {
//           console.error("AJAX Error:", error);
//         });
//     });
//   }
// });

document.addEventListener("DOMContentLoaded", () => {
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
  };

  // Get all necessary elements for channel selection modal
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
  const logicalInputLabel = document.getElementById("wpsd-logical-input-label");
  const logicalInput = document.getElementById("wpsd-logical-input");
  const messageInputGroup = document.getElementById("wpsd-message-input-group");
  const imageUploadBtn = document.getElementById("wpsd-image-upload-btn");
  const imageUploadInput = document.getElementById("wpsd-image-upload-input");
  const channelSaveBtn = document.querySelector(".wpsd-channel-save-btn");

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
        const channelType = card.dataset.channel;
        const channelData = channelMap[channelType];

        if (channelData) {
          channelFormHeaderTitle.textContent = channelData.title;
          channelIconPreview.src = channelData.icon;
          logicalInputLabel.textContent = channelData.fieldLabel;
          logicalInput.placeholder = channelData.fieldPlaceholder;

          messageInputGroup.style.display =
            channelType === "whatsapp" ? "block" : "none";

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
  if (channelSaveBtn) {
    channelSaveBtn.addEventListener("click", () => {
      console.log("Save button clicked. Preparing to send data via AJAX.");

      const channelType = document.querySelector(
        ".wpsd-widget-card[data-channel]"
      ).dataset.channel;
      const channelData = {
        title: document.getElementById("wpsd-channel-title")
          ? document.getElementById("wpsd-channel-title").value
          : channelMap[channelType].title,
        icon: document.getElementById("wpsd-channel-icon-preview").src,
        logical_input: document.getElementById("wpsd-logical-input").value,
        message: document.getElementById("wpsd-message-input").value,
        target: document.getElementById("wpsd-target-select").value,
        hide_after_office_hours: document.getElementById(
          "wpsd-office-hours-toggle"
        ).checked,
        show_on_desktop: document.getElementById("wpsd-show-desktop").checked,
        show_on_mobile: document.getElementById("wpsd-show-mobile").checked,
      };

      const formData = new FormData();
      formData.append("action", "wpsd_save_channel");
      formData.append("channel_name", channelType);
      formData.append("config", JSON.stringify(channelData));
      // NOTE: You must replace 'YOUR_WIDGET_ID' and 'YOUR_NONCE_VALUE' with the actual values from your PHP
      // For example: formData.append('widget_id', '<?php echo esc_attr($widget_id); ?>');
      // For example: formData.append('security', '<?php echo wp_create_nonce("wpsd_nonce"); ?>');
      formData.append("widget_id", wpsd_ajax.widget_id);
      formData.append("security", wpsd_ajax.nonce);

      fetch(ajaxurl, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Server response:", result);
          if (result.success) {
            console.log("Channel saved successfully!");
            if (channelFormModal) {
              channelFormModal.style.display = "none";
            }
          } else {
            console.error("Failed to save channel:", result.data.message);
          }
        })
        .catch((error) => {
          console.error("AJAX Error:", error);
        });
    });
  }
});
