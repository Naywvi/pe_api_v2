module.exports = {
  access_denied: async () => ({
    code: 403,
    title: "Accès refusé",
    message: "Contactez un administrateur",
  }),
  already_banned: async () => ({
    code: 400,
    title: "Déjà banni",
    message: "Contactez un administrateur",
  }),
  already_exists: async () => ({
    code: 409,
    title: "Déjà existant",
    message: "Contactez un administrateur",
  }),
  already_unbanned: async () => ({
    code: 400,
    title: "Déjà débanni",
    message: "Contactez un administrateur",
  }),
  already_updated: async () => ({
    code: 400,
    title: "Déjà mis à jour",
    message: "Contactez un administrateur",
  }),
  bad_request: async () => ({
    code: 400,
    title: "Requête incorrecte",
    message: "Contactez un administrateur",
  }),
  badly_formatted: async () => ({
    code: 400,
    title: "Mauvaise formatation",
    message: "Contactez un administrateur",
  }),
  cant_fire_yourself: async () => ({
    code: 400,
    title: "Impossible de vous licencier vous-même",
    message: "Contactez un administrateur",
  }),
  cant_unfire_yourself: async () => ({
    code: 400,
    title: "Impossible de vous réintégrer vous-même",
    message: "Contactez un administrateur",
  }),
  invalid_data: async () => ({
    code: 400,
    title: "Données invalides",
    message: "Contactez un administrateur",
  }),
  invalid_email: async () => ({
    code: 400,
    title: "Adresse e-mail invalide",
    message: "Contactez un administrateur",
  }),
  invalid_password: async () => ({
    code: 400,
    title: "Mot de passe invalide",
    message: "Contactez un administrateur",
  }),
  invalid_token: async () => ({
    code: 400,
    title: "Token invalide",
    message: "Contactez un administrateur",
  }),
  invalid_username: async () => ({
    code: 400,
    title: "Nom d'utilisateur invalide",
    message: "Contactez un administrateur",
  }),
  missing_information: async () => ({
    code: 400,
    title: "Information manquante",
    message: "Contactez un administrateur",
  }),
  not_enough_arguments: async () => ({
    code: 400,
    title: "Nombre d'arguments insuffisant",
    message:
      "Si vous continuez à avoir ce problème, contactez un administrateur",
  }),
  not_found: async () => ({
    code: 404,
    title: "Non trouvé",
    message: "Contactez un administrateur",
  }),
  not_implemented: async () => ({
    code: 501,
    title: "Non implémenté",
    message: "Contactez un administrateur",
  }),
  no_modifications: async () => ({
    code: 400,
    title: "Aucune modification",
    message: "Contactez un administrateur",
  }),
  server_error: async () => ({
    code: 500,
    title: "Erreur du serveur",
    message: "Contactez un administrateur",
  }),
  society_not_saved: async () => ({
    code: 400,
    title: "Société non enregistrée",
    message: "Contactez un administrateur",
  }),
  unauthorized: async () => ({
    code: 401,
    title: "Non autorisé",
    message: "Contactez un administrateur",
  }),
  unknown_token: async () => ({
    code: 400,
    title: "Token inconnu",
    message: "Contactez un administrateur",
  }),
  update_failed: async () => ({
    code: 403,
    title: "Échec de la mise à jour",
    message: "Contactez un administrateur",
  }),
};
