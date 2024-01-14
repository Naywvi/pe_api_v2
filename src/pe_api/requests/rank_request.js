const error_m = require("../../utils/error");
const RankModel = require("../../database/models/rank");
const utils = require("./utils");

module.exports = {
  create: async (rank_request, res) => {
    try {
      //<== check if the rank already exist
      const exist_rank = await utils.rank_exist(rank_request);
      if (exist_rank) throw error_m.already_exists(res);

      //<== create the rank
      const new_rank = new RankModel(rank_request.request);
      const save_rank = await new_rank.save().catch(() => {
        throw error_m.badly_formatted(res);
      });

      //<== format the result
      const result = await utils.generate_result(
        `${save_rank.rank_name} was created`,
        save_rank,
        false,
        true
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  read: async (rank_request, res) => {
    try {
      //<== check if the rank already exist
      const exist_rank = await utils.rank_exist(rank_request, true);
      if (!exist_rank) throw error_m.not_found(res);

      //<== format the result
      const result = await utils.generate_result(
        `${exist_rank.rank_name} exist`,
        exist_rank,
        false,
        true
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  update: async (rank_request, res) => {
    try {
      //<== check if the rank already exist
      const exist_rank = await utils.rank_exist(rank_request, true);
      if (!exist_rank) throw error_m.not_found(res);

      //<== update the rank
      const update_rank = await RankModel.updateOne(
        { rank_id: rank_request.request.rank_id },
        rank_request.request.update
      ).catch(() => {
        throw error_m.badly_formatted(res);
      });
      if (update_rank.modifiedCount === 0) throw error_m.badly_formatted(res);

      //<== format the result
      const result = await utils.generate_result(
        `${exist_rank.rank_name} exist`,
        exist_rank,
        false,
        true
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  delete: async (rank_request, res) => {
    try {
      //<== check if the rank already exist
      const exist_rank = await utils.rank_exist(rank_request, true);
      if (!exist_rank) throw error_m.not_found(res);
      //<== check if the rank is not the default rank
      if (exist_rank.rank_id === 99) throw error_m.unauthorized(res);

      //<== delete the rank
      const delete_rank = await RankModel.deleteOne({
        rank_id: rank_request.request.rank_id,
      }).catch(() => {
        throw error_m.badly_formatted(res);
      });
      if (delete_rank.deletedCount === 0) throw error_m.badly_formatted(res);

      //<== format the result
      const result = await utils.generate_result(
        `${exist_rank.rank_name} was deleted`,
        exist_rank,
        false,
        true
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  enable: async (rank_request, res) => {
    try {
      //<== check if the rank already exist
      const exist_rank = await utils.rank_exist(rank_request, true);
      if (!exist_rank) throw error_m.not_found(res);
      //<== check if the rank is not the default rank
      if (exist_rank.rank_id === 99) throw error_m.unauthorized(res);

      //<== enable the rank
      const update_rank = await RankModel.updateOne(
        { rank_id: rank_request.request.rank_id },
        { rank_active: true }
      ).catch(() => {
        throw error_m.badly_formatted(res);
      });
      if (update_rank.modifiedCount === 0) throw error_m.already_updated(res);

      //<== format the result
      const result = await utils.generate_result(
        `${exist_rank.rank_name} exist`,
        exist_rank,
        false,
        true
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  disable: async (rank_request, res) => {
    try {
      //<== check if the rank already exist
      const exist_rank = await utils.rank_exist(rank_request, true);
      if (!exist_rank) throw error_m.not_found(res);
      //<== check if the rank is not the default rank
      if (exist_rank.rank_id === 99) throw error_m.unauthorized(res);

      //<== disable the rank
      const update_rank = await RankModel.updateOne(
        { rank_id: rank_request.request.rank_id },
        { rank_active: false }
      ).catch(() => {
        throw error_m.badly_formatted(res);
      });
      if (update_rank.modifiedCount === 0) throw error_m.already_updated(res);

      //<== format the result
      const result = await utils.generate_result(
        `${exist_rank.rank_name} exist`,
        exist_rank,
        false,
        true
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};
