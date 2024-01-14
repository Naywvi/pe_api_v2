module.exports = {
  badly_formatted: async (res) => {
    return res.status(400).json("Badly formatted - Contact an admin");
  },
  not_enough_arguments: async (res) => {
    return res
      .status(400)
      .json(
        "Not enough arguments - If you continue to have this problem contact an admin"
      );
  },
  unknown_token: async (res) => {
    return res.status(400).json("Unknown token - Contact an admin");
  },
  unauthorized: async (res) => {
    return res.status(401).json("Unauthorized - Contact an admin");
  },
  not_found: async (res) => {
    return res.status(404).json("Not found - Contact an admin");
  },
  update_failed: async (res) => {
    return res.status(403).json("Update failed - Contact an admin");
  },
  already_exists: (res) => {
    return res.status(409).json("Already exists - Contact an admin");
  },
  server_error: async (res) => {
    return res.status(500).json("Server error - Contact an admin");
  },
  not_implemented: async (res) => {
    return res.status(501).json("Not implemented - Contact an admin");
  },
  access_denied: async (res) => {
    return res.status(403).json("Access denied - Contact an admin");
  },
  invalid_data: async (res) => {
    return res.status(400).json("Invalid data - Contact an admin");
  },
  invalid_token: async (res) => {
    return res.status(400).json("Invalid token - Contact an admin");
  },
  invalid_password: async (res) => {
    return res.status(400).json("Invalid password - Contact an admin");
  },
  invalid_email: async (res) => {
    return res.status(400).json("Invalid email - Contact an admin");
  },
  invalid_username: async (res) => {
    return res.status(400).json("Invalid username - Contact an admin");
  },
  already_banned: async (res) => {
    return res.status(400).json("Already banned - Contact an admin");
  },
  already_unbanned: async (res) => {
    return res.status(400).json("Already unbanned - Contact an admin");
  },
  already_updated: async (res) => {
    return res.status(400).json("Already updated - Contact an admin");
  },
  no_modifications: async (res) => {
    return res.status(400).json("No modifications - Contact an admin");
  },
  missing_information: async (res) => {
    return res.status(400).json("Missing information - Contact an admin");
  },
};
