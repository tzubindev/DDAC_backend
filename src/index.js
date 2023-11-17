var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var app = express();
var connection = require("./database.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import Controller
const signinController = require("./signinController");
const signupController = require("./signupController");
const rewardController = require("./rewardController");
const RewardHistoryController = require("./rewardHistoryController");
const UserController = require("./userController");
const {
    AppointmentController,
    APPOINTMENT_STATUS_SCHEDULED,
    APPOINTMENT_STATUS_COMPLETED,
} = require("./appointmentController");
const FeedbackController = require("./feedbackController");
const SiteController = require("./siteController");
const DonationController = require("./DonationController");

// Middleware
var corsOptions = {
    origin: `http://localhost:${process.env.CLIENT_PORT || 5173}`,
};

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Invalid token" });
        }

        // Attach the decoded payload to the request for later use
        req.user = decoded;

        // Continue with the request
        next();
    });
};

var curPath = null;

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

port = process.env.PORT;

app.get("/", function (req, res) {
    let sql = "SELECT * FROM Address";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});

connection.connect(function (err) {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Database Connected: " + process.env.HOST);
});

// Get Specific User Data
app.get("/user-data/:id", verifyToken, async function (req, res) {
    const userId = req.params.id;
    try {
        const userControllerInstance = new UserController();
        res.json(await userControllerInstance.getUserDataById(userId));
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

app.delet("/user-data/:id/delete", verifyToken, async function (req, res) {
    const userId = req.params.id;
    try {
        const userControllerInstance = new UserController();
        res.json(await userControllerInstance.deleteUserById(userId));
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

// Get Specific User Data Profile
app.get("/user-data/:id/profile", verifyToken, async function (req, res) {
    const userId = req.params.id;
    try {
        const userControllerInstance = new UserController();
        res.json(await userControllerInstance.getUserDataByIdProfile(userId));
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

// Update Specific User Data Profile
app.put(
    "/user-data/:id/profile/update",
    verifyToken,
    async function (req, res) {
        const uid = req.params.id;
        console.log(req.params.id);
        const { email, password, phone, ic_ppno, address_id } = req.body;

        try {
            const userControllerInstance = new UserController();
            res.json(
                await userControllerInstance.updateUserProfileData(
                    uid,
                    email,
                    password,
                    phone,
                    ic_ppno,
                    address_id
                )
            );
        } catch (error) {
            console.error(`Error in ${curPath} endpoint:`, error);
            res.status(500).send(error.message);
        }
    }
);

app.get("/donation/all", verifyToken, async function (req, res) {
    try {
        const donationData = await new DonationController().getAllDonations();
        res.json(donationData);
    } catch (error) {
        console.error("Error in /donation/:uid endpoint:", error);
        res.status(500).send(error.message);
    }
});

app.post("/user-data/:id/addpoint", verifyToken, async function (req, res) {
    const userId = req.params.id;
    try {
        const { point } = req.body;
        const userControllerInstance = new UserController();
        res.json(await userControllerInstance.addUserPointByID(userId, point));
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

// Get donation data for a specific user
app.get("/donation/:uid", async function (req, res) {
    const userId = req.params.uid;
    try {
        const donationControllerInstance = new DonationController();
        const donationData =
            await donationControllerInstance.getDonationsByUserId(userId);
        res.json(donationData);
    } catch (error) {
        console.error("Error in /donation/:uid endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Add donation data for a specific user
app.post("/donation/:uid/add", verifyToken, async function (req, res) {
    const userId = req.params.uid;
    const { type, amount, food_description } = req.body;

    try {
        // Create an instance of the donation controller
        const donationControllerInstance = new DonationController();

        // Add donation for the specified user
        const result = await donationControllerInstance.addDonation(
            userId,
            type,
            amount,
            food_description
        );

        res.json(result);
    } catch (error) {
        console.error("Error in /donation/:uid/add endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Delete donation by did
app.delete("/donation/:did/delete", verifyToken, async function (req, res) {
    const donationId = req.params.did;

    try {
        // Create an instance of the donation controller
        const donationControllerInstance = new DonationController();

        // Delete donation by its ID
        const result = await donationControllerInstance.deleteDonation(
            donationId
        );

        res.json(result);
    } catch (error) {
        console.error("Error in /donation/:did/delete endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Update donation by did
app.post("/donation/:did/update", async function (req, res) {
    const donationId = req.params.did;
    const { type, amount, food_description } = req.body;

    try {
        // Create an instance of the donation controller
        const donationControllerInstance = new DonationController();

        // Update donation by its ID
        const result = await donationControllerInstance.updateDonation(
            donationId,
            type,
            amount,
            food_description
        );

        res.json(result);
    } catch (error) {
        console.error("Error in /donation/:did/update endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Get all rewards
app.get("/rewards/all", verifyToken, async function (req, res) {
    try {
        const allRewards = await new rewardController().getAllRewards();
        res.json(allRewards);
    } catch (error) {
        console.error("Error in /rewards endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Get a specific reward by rid
app.get("/rewards/:rid", async function (req, res) {
    const rewardId = req.params.rid;

    try {
        const rewardControllerInstance = new rewardController();
        const reward = await rewardControllerInstance.getRewardById(rewardId);
        res.json(reward);
    } catch (error) {
        console.error("Error in /rewards/:rid endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Add a new reward
app.post("/rewards/add", async function (req, res) {
    const { item, description, required_points } = req.body;

    try {
        const rewardControllerInstance = new rewardController();
        const result = await rewardControllerInstance.addReward(
            item,
            description,
            required_points
        );
        res.json(result);
    } catch (error) {
        console.error("Error in /rewards/add endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Delete a reward by rid
app.delete("/rewards/:rid/delete", async function (req, res) {
    const rewardId = req.params.rid;

    try {
        const rewardControllerInstance = new rewardController();
        const result = await rewardControllerInstance.deleteReward(rewardId);
        res.json(result);
    } catch (error) {
        console.error("Error in /rewards/:rid/delete endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Update a reward by rid
app.put("/rewards/:rid/update", async function (req, res) {
    const rewardId = req.params.rid;
    const { item, description, required_points } = req.body;

    try {
        const rewardControllerInstance = new rewardController();
        const result = await rewardControllerInstance.updateReward(
            rewardId,
            item,
            description,
            required_points
        );
        res.json(result);
    } catch (error) {
        console.error("Error in /rewards/:rid/update endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Get all reward history entries
app.get("/reward-history/all", verifyToken, async function (req, res) {
    try {
        const rewardHistoryControllerInstance = new RewardHistoryController();
        const rewardHistoryData =
            await rewardHistoryControllerInstance.getAllRewardHistory();
        res.json(rewardHistoryData);
    } catch (error) {
        console.error("Error in /reward-history endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Get all reward history entries for a specific user ID
app.get("/reward-history/user/:uid", async function (req, res) {
    const userId = req.params.uid;

    try {
        const rewardHistoryControllerInstance = new RewardHistoryController();
        const rewardHistoryData =
            await rewardHistoryControllerInstance.getRewardHistoryByUserId(
                userId
            );
        res.json(rewardHistoryData);
    } catch (error) {
        console.error("Error in /reward-history/user/:uid endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Get reward history entry by rhid
app.get("/reward-history/:rhid", async function (req, res) {
    const rewardHistoryId = req.params.rhid;

    try {
        const rewardHistoryControllerInstance = new RewardHistoryController();
        const rewardHistoryEntry =
            await rewardHistoryControllerInstance.getRewardHistoryById(
                rewardHistoryId
            );
        res.json(rewardHistoryEntry);
    } catch (error) {
        console.error("Error in /reward-history/:rhid endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Add a new reward history entry
app.post("/reward-history/add", async function (req, res) {
    const { uid, timestamp, rid, status } = req.body;

    try {
        const rewardHistoryControllerInstance = new RewardHistoryController();
        const result = await rewardHistoryControllerInstance.addRewardHistory(
            uid,
            timestamp,
            rid,
            status
        );
        res.json(result);
    } catch (error) {
        console.error("Error in /reward-history/add endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Delete a reward history entry by rhid
app.delete(
    "/reward-history/:rhid/delete",
    verifyToken,
    async function (req, res) {
        const rewardHistoryId = req.params.rhid;

        try {
            const rewardHistoryControllerInstance =
                new RewardHistoryController();
            const result =
                await rewardHistoryControllerInstance.deleteRewardHistory(
                    rewardHistoryId
                );
            res.json(result);
        } catch (error) {
            console.error(
                "Error in /reward-history/:rhid/delete endpoint:",
                error
            );
            res.status(500).send(error.message);
        }
    }
);

// Update a reward history entry by rhid
app.put("/reward-history/:rhid/update", verifyToken, async function (req, res) {
    const rewardHistoryId = req.params.rhid;

    try {
        const rewardHistoryControllerInstance = new RewardHistoryController();
        const result =
            await rewardHistoryControllerInstance.updateRewardHistory(
                rewardHistoryId,
                new Date().toISOString().slice(0, 19).replace("T", " "),
                1
            );
        res.json(result);
    } catch (error) {
        console.error("Error in /reward-history/:rhid/update endpoint:", error);
        res.status(500).send(error.message);
    }
});

// sign in
app.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    try {
        const signinControllerInstance = new signinController();
        const result = await signinControllerInstance.signIn(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).send(error.message);
    }
});

// sign up
app.post("/signup", async function (req, res) {
    const { email, password, phone, ic_ppno, address_id } = req.body;

    try {
        const signupControllerInstance = new signupController();
        const result = await signupControllerInstance.signUp(
            email,
            password,
            phone,
            ic_ppno,
            address_id,
            0
        );
        res.send(result);
    } catch (error) {
        // You can add additional error handling here if needed
        console.error("Error in signup endpoint:", error);
    }
});

// ============================== APPOINTMENT
curPath = "/appointment/all/";
app.get(curPath, async function (req, res) {
    try {
        res.json(await new AppointmentController().getAllAppointments());
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/appointment/:aid";
app.get(curPath, async function (req, res) {
    try {
        res.json(
            await new AppointmentController().getAppointmentById(req.params.aid)
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/appointment/:uid/add";
app.post(curPath, verifyToken, async function (req, res) {
    try {
        const { timestamp, location } = req.body;
        res.json(
            await new AppointmentController().addAppointment(
                timestamp,
                location,
                APPOINTMENT_STATUS_SCHEDULED,
                req.params.uid
            )
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/appointment/:aid/delete";
app.delete(curPath, verifyToken, async function (req, res) {
    try {
        res.json(
            await new AppointmentController().deleteAppointment(req.params.aid)
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/appointment/:aid/update";
app.post(curPath, verifyToken, async function (req, res) {
    try {
        const { food_description, status, uid } = req.body;
        const result_update =
            await new AppointmentController().updateAppointment(
                req.params.aid,
                status
            );
        const result_donationHistory =
            await new DonationController().addDonation(
                uid,
                "Food",
                null,
                food_description
            );

        res.json({ result_update, result_donationHistory });
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

// ============================== Feedback
curPath = "/feedback/all/";
app.get(curPath, async function (req, res) {
    try {
        res.json(await new FeedbackController().getAllFeedbacks());
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/feedback/all/:uid";
app.get(curPath, verifyToken, async function (req, res) {
    try {
        res.json(
            await new FeedbackController().getFeedbacksByUserId(req.params.uid)
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/feedback/:token";
app.get(curPath, async function (req, res) {
    try {
        res.json(
            await new FeedbackController().getFeedbackByToken(req.params.token)
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/feedback/:uid/add";
app.post(curPath, verifyToken, async function (req, res) {
    try {
        const { content, type } = req.body;
        res.json(
            await new FeedbackController().addFeedback(
                content,
                type,
                new Date().toISOString().slice(0, 19).replace("T", " "),
                req.params.uid
            )
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/feedback/:token/delete";
app.delete(curPath, async function (req, res) {
    try {
        res.json(
            await new FeedbackController().deleteFeedback(req.params.token)
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/feedback/:token/update";
app.put(curPath, async function (req, res) {
    try {
        const { content, type, timestamp } = req.body;
        const result = await new FeedbackController().updateFeedback(
            content,
            type,
            timestamp,
            req.params.token
        );

        res.json(result);
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

// ============================== InformationSite
curPath = "/site/all/";
app.get(curPath, verifyToken, async function (req, res) {
    try {
        res.json(await new SiteController().getAllSites());
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/site/:pid";
app.get(curPath, async function (req, res) {
    try {
        res.json(await new SiteController().getSiteByPid(req.params.pid));
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/site/:uid";
app.get(curPath, async function (req, res) {
    try {
        res.json(await new SiteController().getSiteByUserId(req.params.uid));
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/site/:uid/add";
app.post(curPath, async function (req, res) {
    try {
        const { type, title, category, description, timestamp } = req.body;
        res.json(
            await new SiteController().addSite(
                type,
                title,
                category,
                description,
                timestamp,
                req.params.uid
            )
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/site/:pid/delete";
app.delete(curPath, verifyToken, async function (req, res) {
    try {
        res.json(await new SiteController().deleteSite(req.params.pid));
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/site/:pid/update";
app.put(curPath, verifyToken, async function (req, res) {
    try {
        const { type, title, category, description } = req.body;
        const result = await new SiteController().updateSite(
            type,
            title,
            category,
            description,
            new Date().toISOString().slice(0, 19).replace("T", " "),
            req.params.pid
        );
        res.json(result);
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

delete curPath;

// ============================== Server Listener
app.listen(port, function () {
    console.log("App Listening on port", port);
});
