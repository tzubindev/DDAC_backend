const connection = require("./database");

class SiteController {
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

module.exports = SiteController;
