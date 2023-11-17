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

    async deleteUserById(uid) {
        try {
            const sql = [
                "DELETE FROM appointment WHERE uid = ?;",
                "DELETE FROM donation_history WHERE uid = ?;",
                "DELETE FROM feedback WHERE uid = ?;",
                "DELETE FROM information_site WHERE uid = ?;",
                "DELETE FROM reward_history WHERE uid = ?;",
                "DELETE FROM user_data WHERE uid = ?;",
            ];
            for (const s of sql) {
                await this.query(s, uid);
            }
            return { message: "Succesfully Delete User Account." };
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

    async getUserDataByIdProfile(uid) {
        try {
            const sql = "SELECT * FROM user_data WHERE uid = ?";
            const sites = await this.query(sql, uid);
            return sites;
        } catch (error) {
            throw error;
        }
    }

    async updateUserProfileData(
        uid,
        email,
        password,
        phone,
        ic_ppno,
        address_id
    ) {
        try {
            if (!password) {
                const sql =
                    "UPDATE user_data SET email = ?, phone = ?, ic_ppno = ?, address_id = ? WHERE uid = ?";
                const result = await this.query(sql, [
                    email,
                    phone,
                    ic_ppno,
                    address_id,
                    uid,
                ]);
                await this.query("COMMIT");

                // Check if more than 0 rows were affected
                if (result && result.affectedRows > 0) {
                    // Rows were affected, consider it a success
                    return {
                        message: `User profile data updated for UID ${uid}`,
                    };
                } else {
                    return {
                        message: `No user found with UID ${uid}`,
                    };
                }
            } else {
                const sql =
                    "UPDATE user_data SET email = ?, password = ?, phone = ?, ic_ppno = ?, address_id = ? WHERE uid = ?";
                const result = await this.query(sql, [
                    email,
                    password,
                    phone,
                    ic_ppno,
                    address_id,
                    uid,
                ]);
                await this.query("COMMIT");

                // Check if more than 0 rows were affected
                if (result && result.affectedRows > 0) {
                    // Rows were affected, consider it a success
                    return {
                        message: `User profile data updated for UID ${uid}`,
                    };
                } else {
                    return {
                        message: `No user found with UID ${uid}`,
                    };
                }
            }
        } catch (err) {
            await this.query("ROLLBACK");

            throw new Error("Error updating user data" + err);
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
