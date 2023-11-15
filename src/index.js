var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var app = express();
var connection = require("./database.js");
require("dotenv").config();

// Import Controller
const signinController = require("./signinController");
const signupController = require("./signupController");
const donationController = require("./donationController");
const rewardController = require("./rewardController");
const rewardHistoryController = require("./rewardHistoryController");
const {
    AppointmentController,
    APPOINTMENT_STATUS_SCHEDULED,
    APPOINTMENT_STATUS_COMPLETED,
} = require("./appointmentController");
const FeedbackController = require("./feedbackController");
const SiteController = require("./siteController");

var corsOptions = { origin: `http://localhost:${process.env.PORT}` };
var curPath = null;

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

port = process.env.PORT;

console.log(port);

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
    console.log("Database Connected!");
});

// Get donation data for a specific user
app.get("/donation/:id", async function (req, res) {
    const userId = req.params.id;
    try {
        const donationControllerInstance = new donationController();
        const donationData = await donationControllerInstance.getByUserId(
            userId
        );
        res.json(donationData);
    } catch (error) {
        console.error("Error in /donation/:id endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Add donation data for a specific user
app.post("/donation/:id/add", async function (req, res) {
    const userId = req.params.id;
    const { type, amount, food_description } = req.body;

    try {
        // Create an instance of the donation controller
        const donationControllerInstance = new donationController();

        // Add donation for the specified user
        const result = await donationControllerInstance.addDonation(
            userId,
            type,
            amount,
            food_description
        );

        res.json(result);
    } catch (error) {
        console.error("Error in /donation/:id/add endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Delete donation by did
app.delete("/donation/:did/delete", async function (req, res) {
    const donationId = req.params.did;

    try {
        // Create an instance of the donation controller
        const donationControllerInstance = new donationController();

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
app.put("/donation/:did/update", async function (req, res) {
    const donationId = req.params.did;
    const { type, amount, food_description } = req.body;

    try {
        // Create an instance of the donation controller
        const donationControllerInstance = new donationController();

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
app.get("/rewards", async function (req, res) {
    try {
        const rewardControllerInstance = new rewardController();
        const allRewards = await rewardControllerInstance.getAllRewards();
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
app.get("/reward-history", async function (req, res) {
    try {
        const rewardHistoryController = new RewardHistoryController();
        const rewardHistoryData =
            await rewardHistoryController.getAllRewardHistory();
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
        const rewardHistoryControllerInstance = new rewardHistoryController();
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
        const rewardHistoryControllerInstance = new rewardHistoryController();
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
        const rewardHistoryControllerInstance = new rewardHistoryController();
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
app.delete("/reward-history/:rhid/delete", async function (req, res) {
    const rewardHistoryId = req.params.rhid;

    try {
        const rewardHistoryControllerInstance = new rewardHistoryController();
        const result =
            await rewardHistoryControllerInstance.deleteRewardHistory(
                rewardHistoryId
            );
        res.json(result);
    } catch (error) {
        console.error("Error in /reward-history/:rhid/delete endpoint:", error);
        res.status(500).send(error.message);
    }
});

// Update a reward history entry by rhid
app.put("/reward-history/:rhid/update", async function (req, res) {
    const rewardHistoryId = req.params.rhid;
    const { uid, timestamp, rid, status } = req.body;

    try {
        const rewardHistoryControllerInstance = new rewardHistoryController();
        const result =
            await rewardHistoryControllerInstance.updateRewardHistory(
                rewardHistoryId,
                uid,
                timestamp,
                rid,
                status
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
        res.json(result); // Fix: use the correct variable 'result'
    } catch (error) {
        res.status(401).send(error.message);
    }
});

// sign up
app.post("/signup", async function (req, res) {
    const { email, password, phone, ic_ppno, address_id, reward_points } =
        req.body;

    try {
        const signupControllerInstance = new signupController();
        await signupControllerInstance.signUp(
            email,
            password,
            phone,
            ic_ppno,
            address_id,
            reward_points,
            res
        );
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

curPath = "/appointment/:id/add";
app.post(curPath, async function (req, res) {
    try {
        const { timestamp } = req.body;
        res.json(
            await new AppointmentController().addAppointment(
                timestamp,
                APPOINTMENT_STATUS_SCHEDULED,
                req.params.id
            )
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/appointment/:aid/delete";
app.delete(curPath, async function (req, res) {
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
app.put(curPath, async function (req, res) {
    try {
        const { timestamp, status, location } = req.body;
        const result = await new AppointmentController().updateAppointment(
            req.params.aid,
            timestamp,
            status,
            location
        );

        res.json(result);
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

curPath = "/feedback/all/:id";
app.get(curPath, async function (req, res) {
    try {
        res.json(
            await new FeedbackController().getFeedbacksByUserId(req.params.id)
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

curPath = "/feedback/:id/add";
app.post(curPath, async function (req, res) {
    try {
        const { content, type, timestamp } = req.body;
        res.json(
            await new FeedbackController().addFeedback(
                content,
                type,
                timestamp,
                req.params.id
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
app.get(curPath, async function (req, res) {
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

curPath = "/site/:id";
app.get(curPath, async function (req, res) {
    try {
        res.json(await new SiteController().getSiteByUserId(req.params.id));
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/site/:id/add";
app.post(curPath, async function (req, res) {
    try {
        const { type, title, description, timestamp } = req.body;
        res.json(
            await new SiteController().addSite(
                type,
                title,
                description,
                timestamp,
                req.params.id
            )
        );
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/site/:pid/delete";
app.delete(curPath, async function (req, res) {
    try {
        res.json(await new SiteController().deleteSite(req.params.pid));
    } catch (error) {
        console.error(`Error in ${curPath} endpoint:`, error);
        res.status(500).send(error.message);
    }
});

curPath = "/site/:pid/update";
app.put(curPath, async function (req, res) {
    try {
        const { type, title, description, timestamp } = req.body;
        const result = await new FeedbackController().updateFeedback(
            type,
            title,
            description,
            timestamp,
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
