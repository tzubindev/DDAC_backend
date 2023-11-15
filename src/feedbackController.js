const connection = require("./database");

class FeedbackController {
    async getAllFeedbacks() {
        try {
            const sql = "SELECT * FROM feedback";
            const feedbacks = await this.query(sql);
            return feedbacks;
        } catch (error) {
            throw error;
        }
    }

    async getFeedbackByToken(token) {
        try {
            const sql = "SELECT * FROM feedback WHERE token = ?";
            const feedback = await this.query(sql, [token]);
            return feedback[0];
        } catch (error) {
            throw error;
        }
    }

    async getFeedbacksByUserId(uid) {
        try {
            const sql = "SELECT * FROM feedback WHERE uid = ?";
            const feedback = await this.query(sql, [uid]);
            return feedback[0];
        } catch (error) {
            throw error;
        }
    }

    async addFeedback(content, type, timestamp, uid) {
        try {
            const sql =
                "INSERT INTO feedback ( content, type, timestamp, uid) VALUES ( ?, ?, ?, ? )";
            const result = await this.query(sql, [
                content,
                type,
                timestamp,
                uid,
            ]);
            return {
                message: "Feedback added successfully",
                token: result.insertId,
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteFeedback(token) {
        try {
            const sql = "DELETE FROM feedback WHERE token = ?";
            const result = await this.query(sql, [token]);

            if (result.affectedRows === 1) {
                return { message: "Feedback deleted successfully" };
            } else {
                throw new Error("Feedback deletion failed");
            }
        } catch (error) {
            throw error;
        }
    }

    async updateFeedback(content, type, timestamp, token) {
        try {
            const sql =
                "UPDATE feedback SET content = ?, type = ?, timestamp = ? WHERE token = ?";
            const result = await this.query(sql, [
                content,
                type,
                timestamp,
                token,
            ]);

            if (result.affectedRows === 1) {
                return { message: "Feedback updated successfully" };
            } else {
                throw new Error("Feedback update failed");
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

module.exports = FeedbackController;
