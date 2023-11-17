const connection = require("./database");

class RewardHistoryController {
    // Get all reward history entries
    async getAllRewardHistory() {
        try {
            const sql = "SELECT * FROM reward_history";
            const result = await this.query(sql);
            return result;
        } catch (error) {
            throw new Error("Error fetching reward history entries");
        }
    }

    // Get all reward history entries for a specific user ID
    async getRewardHistoryByUserId(userId) {
        try {
            const sql = "SELECT * FROM reward_history WHERE uid = ?";
            const result = await this.query(sql, [userId]);
            return result;
        } catch (error) {
            throw new Error("Error fetching reward history entries for user");
        }
    }

    // Get reward history entry by rhid
    async getRewardHistoryById(rewardHistoryId) {
        try {
            const sql = "SELECT * FROM reward_history WHERE rhid = ?";
            const result = await this.query(sql, [rewardHistoryId]);
            return result[0];
        } catch (error) {
            throw new Error("Error fetching reward history entry by ID");
        }
    }

    // Add a new reward history entry
    async addRewardHistory(uid, timestamp, rid, status) {
        try {
            const sql =
                "INSERT INTO reward_history (uid, timestamp, rid, status) VALUES (?, ?, ?, ?)";
            const result = await this.query(sql, [uid, timestamp, rid, status]);
            return "Reward history entry added successfully";
        } catch (error) {
            throw new Error("Error adding reward history entry");
        }
    }

    // Delete a reward history entry by rhid
    async deleteRewardHistory(rewardHistoryId) {
        try {
            const sql = "DELETE FROM reward_history WHERE rhid = ?";
            await this.query(sql, [rewardHistoryId]);
            return { message: "Reward history entry deleted successfully" };
        } catch (error) {
            throw new Error("Error deleting reward history entry");
        }
    }

    // Update a reward history entry by rhid
    async updateRewardHistory(rewardHistoryId, timestamp, status) {
        try {
            const sql =
                "UPDATE reward_history SET timestamp = ?, status = ? WHERE rhid = ?";
            await this.query(sql, [timestamp, status, rewardHistoryId]);
            return { message: "Reward history entry updated successfully" };
        } catch (error) {
            throw new Error("Error updating reward history entry" + error);
        }
    }

    // Utility function for executing SQL queries
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

module.exports = RewardHistoryController;
