const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("./database");

class SigninController {
    async signIn(email, password) {
        // Retrieve user from the database by email
        console.log("Authenticating");
        let sql = "SELECT * FROM user_data WHERE email = ?";

        const results = await this.query(sql, [email]);
        console.log(results);

        if (results.length === 0) {
            return false;
        }

        const user = results[0];
        console.log("Here");

        // Compare the entered password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            // Generate a JWT token
            const token = jwt.sign(
                { userId: user.uid },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );
            console.log("Authentication End");
            return { uid: user.uid, token: token, is_admin: user.is_admin };
        } else {
            console.log("Invalid credentials");
            return false;
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

module.exports = SigninController;
