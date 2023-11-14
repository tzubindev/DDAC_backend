const bcrypt = require("bcrypt");
const connection = require("./database");

class SignupController {
    // Inside SignupController class
    async signUp(email, password, phone, ic_ppno, address_id, reward_points, res) {
        try {
            // Check if the email already exists
            const emailExists = await this.checkEmailExists(email);
            if (emailExists) {
                throw new Error("Email already registered. Please use a different email.");
            }

            // Hash the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Get the last UID and increment by one
            const lastUidResult = await this.query("SELECT MAX(uid) AS lastUid FROM UserData");
            const lastUid = lastUidResult[0].lastUid || 0;
            const newUid = lastUid + 1;

            // Insert the new user into the database
            const sql = "INSERT INTO UserData (uid, email, password, phone, ic_ppno, address_id, reward_points) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const result = await this.query(sql, [newUid, email, hashedPassword, phone, ic_ppno, address_id, reward_points]);

            // Check if the insertion was successful
            if (result.affectedRows === 1) {
                return res.send("Sign-up successful");
            } else {
                throw new Error("User registration failed");
            }
        } catch (error) {
            // Handle errors here
            console.error("Error during sign-up:", error);
            res.status(500).send(error.message);
            throw new Error("Internal Server Error");
        }
    }

    async checkEmailExists(email) {
        // Check if the email already exists in the database
        const result = await this.query("SELECT COUNT(*) AS count FROM UserData WHERE email = ?", [email]);
        return result[0].count > 0;
    }

    query(sql, params) {
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

module.exports = SignupController;
