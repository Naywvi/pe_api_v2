module.exports = {
  run: async (am_organisation, pm_organisation, am_input, pm_input) => {
    if (am_input < am_organisation || am_input > am_organisation) return false;
    if (pm_input < pm_organisation || pm_input > pm_organisation) return false;
    return true;
  },
};
