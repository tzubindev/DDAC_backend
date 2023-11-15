const connection = require("./database");

class SiteController {
    async getAllSites() {
        try {
            const sql = "SELECT * FROM information_site";
            const sites = await this.query(sql);
            return sites;
        } catch (error) {
            throw error;
        }
    }

    async getSiteByPid(pid) {
        try {
            const sql = "SELECT * FROM information_site WHERE pid = ?";
            const site = await this.query(sql, [pid]);
            return site[0];
        } catch (error) {
            throw error;
        }
    }

    async getSiteByUserId(uid) {
        try {
            const sql = "SELECT * FROM information_site WHERE uid = ?";
            const site = await this.query(sql, [uid]);
            return site[0];
        } catch (error) {
            throw error;
        }
    }

    async addSite(type, title, description, timestamp, uid) {
        try {
            const sql =
                "INSERT INTO site ( type, title, description, timestamp, uid) VALUES ( ?, ?, ?, ?, ? )";
            const result = await this.query(sql, [
                type,
                title,
                description,
                timestamp,
                uid,
            ]);
            return {
                message: "Site added successfully",
                pid: result.insertId,
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteSite(pid) {
        try {
            const sql = "DELETE FROM information_site WHERE pid = ?";
            const result = await this.query(sql, [pid]);

            if (result.affectedRows === 1) {
                return { message: "Site deleted successfully" };
            } else {
                throw new Error("Site deletion failed");
            }
        } catch (error) {
            throw error;
        }
    }

    async updateSite(type, title, description, timestamp, pid) {
        try {
            const sql =
                "UPDATE site SET type = ?, title = ?, description = ?, timestamp = ? WHERE pid = ?";
            const result = await this.query(sql, [
                type,
                title,
                description,
                timestamp,
                pid,
            ]);

            if (result.affectedRows === 1) {
                return { message: "Site updated successfully" };
            } else {
                throw new Error("Site update failed");
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

module.exports = SiteController;
