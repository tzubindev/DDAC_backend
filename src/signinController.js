const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("./database");

class SigninController {
    async signIn(email, password) {
        // Retrieve user from the database by email
        let sql = "SELECT * FROM user_data WHERE email = ?";
        const results = await this.query(sql, [email]);

        if (results.length === 0) {
            throw new Error("Invalid credentials");
        }

        const user = results[0];

        // Compare the entered password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Generate a JWT token
            const token = jwt.sign(
                { userId: user.id },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );
            return { token };
        } else {
            console.log("Invalid credentials");
            throw new Error("Invalid credentials");
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
