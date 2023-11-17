const connection = require("./database");

class UserController {
    async addUserPointByID(uid, point) {
        try {
            const sql =
                "UPDATE user_data SET reward_points = reward_points + ? WHERE uid = ?";
            const result = await this.query(sql, [point, uid]);

            // Check if more than 0 rows were affected
            if (result && result.affectedRows > 0) {
                // Rows were affected, consider it a success
                return {
                    message: `Points added for UID ${uid}`,
                };
            } else {
                return {
                    message: `No user found with UID ${uid}`,
                };
            }
        } catch (error) {
            throw error;
        }
    }
    async getUserDataById(uid) {
        try {
            const sql = "SELECT phone FROM user_data WHERE uid = ?";
            const sites = await this.query(sql, uid);
            return sites;
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

module.exports = UserController;
