// donationController.js
const connection = require("./database");

class DonationController {
    // Get donation data based on user ID
    async getByUserId(userId) {
        try {
            // Query the database to get donation data for the specified user ID
            const sql = "SELECT * FROM donation_history WHERE uid = ?";
            const results = await this.query(sql, [userId]);
            return results;
        } catch (error) {
            console.error("Error fetching donation data:", error);
            throw new Error("Internal Server Error");
        }
    }

    // Add donation for a specific user
    async addDonation(userId, type, amount, food_description) {
        try {
            // Insert the new donation into the database
            const sql =
                "INSERT INTO donation_history (type, amount, food_description, uid, timestamp) VALUES (?, ?, ?, ?, NOW())";
            const result = await this.query(sql, [
                type,
                amount,
                food_description,
                userId,
                new Date().toISOString().slice(0, 19).replace("T", " "),
            ]);

            // Check if the insertion was successful
            if (result.affectedRows === 1) {
                return {
                    message: "Donation added successfully",
                    did: result.insertId,
                };
            } else {
                return { message: "Donation addition failed" };
            }
        } catch (error) {
            console.error("Error during donation addition:", error);
            return { message: "Internal Server Error" };
        }
    }

    // Delete donation by did
    async deleteDonation(donationId) {
        try {
            // Delete the donation from the database
            const sql = "DELETE FROM donation_history WHERE did = ?";
            const result = await this.query(sql, [donationId]);

            // Check if the deletion was successful
            if (result.affectedRows === 1) {
                return { message: "Donation deleted successfully" };
            } else {
                throw new Error("Donation deletion failed");
            }
        } catch (error) {
            console.error("Error during donation deletion:", error);
            throw new Error("Internal Server Error");
        }
    }

    // Update donation by did
    async updateDonation(donationId, type, amount, food_description) {
        try {
            // Update the donation in the database
            const sql =
                "UPDATE donation_history SET type = ?, amount = ?, food_description = ? WHERE did = ?";
            const result = await this.query(sql, [
                type,
                amount,
                food_description,
                donationId,
            ]);

            // Check if the update was successful
            if (result.affectedRows === 1) {
                return { message: "Donation updated successfully" };
            } else {
                throw new Error("Donation update failed");
            }
        } catch (error) {
            console.error("Error during donation update:", error);
            throw new Error("Internal Server Error");
        }
    }

    query(sql, params) {
        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = DonationController;
