import { useUserStore } from "~/stores/user";

/**
 * Composable for logging user actions to adm_message_log.
 * Use for delete confirmation (TRX-CNF-002), create success (TRX-INF-005), update success (TRX-INF-006).
 *
 * @param {Object} options - Page context
 * @param {string} options.pageName - Page title (e.g. "Budget Code")
 * @param {string} options.moduleName - Parent menu (e.g. "Budget", "Setup", "Purchasing")
 * @param {string} options.pageBreadcrumbText - Full breadcrumb (e.g. "Dashboard > Budget > Setup > Budget Code")
 */
export function useMessageLog(options) {
  let userStore = {};
  try {
    userStore = useUserStore() || {};
  } catch (_) {
    // Store may not be ready (e.g. before pinia is mounted)
  }
  const { pageName = "", moduleName = "", pageBreadcrumbText = "" } = options || {};

  const userId = typeof userStore?.username !== "undefined" ? userStore.username : "unknown";
  const userRole = Array.isArray(userStore?.roles) ? (userStore.roles || []).join(",") : (userStore?.roles != null ? String(userStore.roles) : "");

  /** Log delete confirmation prompt before showing popup. Returns log id or null. */
  async function logDeleteConfirmationPrompt(messageText) {
    try {
      const res = await $fetch("/api/message-log", {
        method: "POST",
        body: {
          mm_mesg_code: "TRX-CNF-002",
          ml_mesg_desc: messageText,
          ml_user_id: userId,
          ml_user_role: userRole,
          ml_page_name: pageName,
          ml_module_name: moduleName,
          ml_page_breadcrumb: pageBreadcrumbText,
        },
      });
      return res?.data?.id ?? null;
    } catch (error) {
      console.error("Failed to log delete confirmation prompt:", error);
      return null;
    }
  }

  /** Update the log row with user action: "Cancel" or "Yes, delete it!" */
  async function updateMessageLogAction(logId, ml_user_action) {
    if (logId == null) return;
    try {
      await $fetch(`/api/message-log/${logId}`, {
        method: "PATCH",
        body: { ml_user_action },
      });
    } catch (error) {
      console.error("Failed to update message log action:", error);
    }
  }

  /** Log create success (TRX-INF-005). entityLabel e.g. "Budget Code created". */
  async function logCreateSuccess(successMessage, entityLabel = "Record created") {
    try {
      await $fetch("/api/message-log", {
        method: "POST",
        body: {
          mm_mesg_code: "TRX-INF-005",
          mm_mesg_type: "INFO",
          mm_mesg_category: "TRANSACTION",
          mm_user_mesg: entityLabel,
          ml_mesg_desc: successMessage,
          ml_user_id: userId,
          ml_user_role: userRole,
          ml_page_name: pageName,
          ml_module_name: moduleName,
          ml_page_breadcrumb: pageBreadcrumbText,
        },
      });
    } catch (err) {
      console.error("Failed to log create success:", err);
    }
  }

  /** Log update success (TRX-INF-006). entityLabel e.g. "Budget Code updated". */
  async function logUpdateSuccess(successMessage, entityLabel = "Record updated") {
    try {
      await $fetch("/api/message-log", {
        method: "POST",
        body: {
          mm_mesg_code: "TRX-INF-006",
          mm_mesg_type: "INFO",
          mm_mesg_category: "TRANSACTION",
          mm_user_mesg: entityLabel,
          ml_mesg_desc: successMessage,
          ml_user_id: userId,
          ml_user_role: userRole,
          ml_page_name: pageName,
          ml_module_name: moduleName,
          ml_page_breadcrumb: pageBreadcrumbText,
        },
      });
    } catch (err) {
      console.error("Failed to log update success:", err);
    }
  }

  return {
    logDeleteConfirmationPrompt,
    updateMessageLogAction,
    logCreateSuccess,
    logUpdateSuccess,
  };
}
