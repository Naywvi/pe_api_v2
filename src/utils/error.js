module.exports = {
  badly_formatted: async () => ({
    code: 400,
    title: "Badly formatted",
    message: "Contact an admin",
  }),
  not_enough_arguments: async () => ({
    code: 400,
    title: "Not enough arguments",
    message: "If you continue to have this problem contact an admin",
  }),
  unknown_token: async () => ({
    code: 400,
    title: "Unknown token",
    message: "Contact an admin",
  }),
  unauthorized: async () => ({
    code: 401,
    title: "Unauthorized",
    message: "Contact an admin",
  }),
  not_found: async () => ({
    code: 404,
    title: "Not found",
    message: "Contact an admin",
  }),
  update_failed: async () => ({
    code: 403,
    title: "Update failed",
    message: "Contact an admin",
  }),
  already_exists: async () => ({
    code: 409,
    title: "Already exists",
    message: "Contact an admin",
  }),
  server_error: async () => ({
    code: 500,
    title: "Server error",
    message: "Contact an admin",
  }),
  not_implemented: async () => ({
    code: 501,
    title: "Not implemented",
    message: "Contact an admin",
  }),
  access_denied: async () => ({
    code: 403,
    title: "Access denied",
    message: "Contact an admin",
  }),
  invalid_data: async () => ({
    code: 400,
    title: "Invalid data",
    message: "Contact an admin",
  }),
  invalid_token: async () => ({
    code: 400,
    title: "Invalid token",
    message: "Contact an admin",
  }),
  invalid_password: async () => ({
    code: 400,
    title: "Invalid password",
    message: "Contact an admin",
  }),
  invalid_email: async () => ({
    code: 400,
    title: "Invalid email",
    message: "Contact an admin",
  }),
  invalid_username: async () => ({
    code: 400,
    title: "Invalid username",
    message: "Contact an admin",
  }),
  already_banned: async () => ({
    code: 400,
    title: "Already banned",
    message: "Contact an admin",
  }),
  already_unbanned: async () => ({
    code: 400,
    title: "Already unbanned",
    message: "Contact an admin",
  }),
  already_updated: async () => ({
    code: 400,
    title: "Already updated",
    message: "Contact an admin",
  }),
  no_modifications: async () => ({
    code: 400,
    title: "No modifications",
    message: "Contact an admin",
  }),
  missing_information: async () => ({
    code: 400,
    title: "Missing information",
    message: "Contact an admin",
  }),
  society_not_saved: async () => ({
    code: 400,
    title: "Society not saved",
    message: "Contact an admin",
  }),
  cant_fire_yourself: async () => ({
    code: 400,
    title: "Can't fire yourself",
    message: "Contact an admin",
  }),
  cant_unfire_yourself: async () => ({
    code: 400,
    title: "Can't unfire yourself",
    message: "Contact an admin",
  }),
  bad_request: async () => ({
    code: 400,
    title: "Bad request",
    message: "Contact an admin",
  }),
};
