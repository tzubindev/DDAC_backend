const connection = require("./database");

class RewardController {
   
    async getAllRewards() {
        try {
            const sql = "SELECT * FROM rewards";
            const rewards = await this.query(sql);
            return rewards;
        } catch (error) {
            throw error;
        }
    }
    
    async getRewardById(rewardId) {
        try {
            const sql = "SELECT * FROM rewards WHERE rid = ?";
            const reward = await this.query(sql, [rewardId]);
            return reward[0];
        } catch (error) {
            throw error;
        }
    }

    async addReward(item, description, required_points) {
        try {
            const sql =
                "INSERT INTO rewards (item, description, required_points) VALUES (?, ?, ?)";
            const result = await this.query(sql, [
                item,
                description,
                required_points,
            ]);
            return {
                message: "Reward added successfully",
                rewardId: result.insertId,
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteReward(rewardId) {
        try {
            const sql = "DELETE FROM rewards WHERE rid = ?";
            const result = await this.query(sql, [rewardId]);

            if (result.affectedRows === 1) {
                return { message: "Reward deleted successfully" };
            } else {
                throw new Error("Reward deletion failed");
            }
        } catch (error) {
            throw error;
        }
    }

    async updateReward(rewardId, item, description, required_points) {
        try {
            const sql =
                "UPDATE rewards SET item = ?, description = ?, required_points = ? WHERE rid = ?";
            const result = await this.query(sql, [
                item,
                description,
                required_points,
                rewardId,
            ]);

            if (result.affectedRows === 1) {
                return { message: "Reward updated successfully" };
            } else {
                throw new Error("Reward update failed");
            }
        } catch (error) {
            throw error;
        }
    }

    // Helper method for database queries
    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = RewardController;
