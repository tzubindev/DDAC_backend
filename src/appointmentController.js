const connection = require("./database");

class AppointmentController {
    async getAllAppointments() {
        try {
            const sql = "SELECT * FROM appointment";
            const appointments = await this.query(sql);
            return appointments;
        } catch (error) {
            throw error;
        }
    }

    async getAppointmentById(aid) {
        try {
            const sql = "SELECT * FROM appointment WHERE aid = ?";
            const appointment = await this.query(sql, [aid]);
            return appointment[0];
        } catch (error) {
            throw error;
        }
    }

    async getAppointmentsByUserId(uid) {
        try {
            const sql = "SELECT * FROM appointment WHERE uid = ?";
            const appointment = await this.query(sql, [uid]);
            return appointment[0];
        } catch (error) {
            throw error;
        }
    }

    async addAppointment(timestamp, location, status, uid) {
        try {
            const sql =
                "INSERT INTO appointment ( timestamp, status, location, uid) VALUES ( ?, ?, ?, ?)";
            const result = await this.query(sql, [
                timestamp,
                status,
                location,
                uid,
            ]);
            return {
                message: "Appointment added successfully",
                aid: result.insertId,
            };
        } catch (error) {
            return {
                message: "Appointment scheduled fail",
                error: error.message,
            };
        }
    }

    async deleteAppointment(aid) {
        try {
            const sql = "DELETE FROM appointment WHERE aid = ?";
            const result = await this.query(sql, [aid]);

            if (result.affectedRows === 1) {
                return { message: "Appointment deleted successfully" };
            } else {
                throw new Error("Appointment deletion failed");
            }
        } catch (error) {
            throw error;
        }
    }

    async updateAppointment(aid, timestamp, status, location) {
        try {
            const sql =
                "UPDATE appointment SET timestamp = ?, status = ?, location = ? WHERE aid = ?";
            const result = await this.query(sql, [
                timestamp,
                status,
                location,
                aid,
            ]);

            if (result.affectedRows === 1) {
                return { message: "Appointment updated successfully" };
            } else {
                throw new Error("Appointment update failed");
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

const APPOINTMENT_STATUS_SCHEDULED = "scheduled";
const APPOINTMENT_STATUS_COMPLETED = "completed";

module.exports = {
    AppointmentController,
    APPOINTMENT_STATUS_COMPLETED,
    APPOINTMENT_STATUS_SCHEDULED,
};
