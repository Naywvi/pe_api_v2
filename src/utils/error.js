const email = "contact@pyramideenergies.com";
module.exports = {
  badly_formated: {
    code: 400,
    message: "Badly formatted - Contact an admin",
    mail: email,
  },
  not_enough_arguments: {
    code: 400,
    message:
      "Not enough arguments - If you continue to have this problem contact an admin",
    mail: email,
  },
  unknown_token: {
    code: 400,
    message: "Unknown token - Contact an admin",
    mail: email,
  },
  unauthorized: {
    code: 401,
    message: "Unauthorized - Contact an admin",
    mail: email,
  },
  not_found: {
    code: 404,
    message: "Not found - Contact an admin",
    mail: email,
  },
  update_failed: {
    code: 403,
    message: "Update failed - Contact an admin",
    mail: email,
  },
  already_exists: {
    code: 409,
    message: "Already exists - Contact an admin",
    mail: email,
  },
  server_error: {
    code: 500,
    message: "Server error - Contact an admin",
    mail: email,
  },
  not_implemented: {
    code: 501,
    message: "Not implemented - Contact an admin",
    mail: email,
  },
  acces_denied: {
    code: 403,
    message: "Acces denied - Contact an admin",
    mail: email,
  },
  invalid_data: {
    code: 400,
    message: "Invalid data - Contact an admin",
    mail: email,
  },
  invalid_token: {
    code: 400,
    message: "Invalid token - Contact an admin",
    mail: email,
  },
  invalid_password: {
    code: 400,
    message: "Invalid password - Contact an admin",
    mail: email,
  },
  invalid_email: {
    code: 400,
    message: "Invalid email - Contact an admin",
    mail: email,
  },
  invalid_username: {
    code: 400,
    message: "Invalid username - Contact an admin",
    mail: email,
  },
  already_banned: {
    code: 400,
    message: "Already banned - Contact an admin",
    mail: email,
  },
  already_unbanned: {
    code: 400,
    message: "Already unbanned - Contact an admin",
    mail: email,
  },
  already_updated: {
    code: 400,
    message: "Already updated - Contact an admin",
    mail: email,
  },
};
