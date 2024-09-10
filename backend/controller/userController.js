const UserModel = require('../models/userSchema');
const DailyModel = require('../models/dailySchema');
const SocialModel = require('../models/socialSchema');
const AnnoucementModel = require('../models/annoucementSchema');
const { TELEGRAM_BOT_TOKEN, CHAT_ID } = require('../Config/env');
const { check48Hour, check24hour, check1hour } = require('../utils/timeCheckUtils');
const { updateReferrals } = require('../utils/updateReferalUtils');
const user = require('../models/userSchema');

const upgradeCosts = [
    500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000,
    1024000, 2048000,
];
const tapValues = [
    {
        level: 1,
        value: 2,
    },
    {
        level: 2,
        value: 3,
    },
    {
        level: 3,
        value: 4,
    },
    {
        level: 4,
        value: 5,
    },
    {
        level: 5,
        value: 6,
    },
    {
        level: 6,
        value: 7,
    },
    {
        level: 7,
        value: 8,
    },
    {
        level: 8,
        value: 9,
    },
    {
        level: 9,
        value: 10,
    },
    {
        level: 10,
        value: 11,
    },
    {
        level: 11,
        value: 12,
    },
    {
        level: 12,
        value: 13,
    },
    {
        level: 13,
        value: 14,
    },
];
const energyUpgradeCosts = [
    500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000,
    1024000, 2048000, 4096000,
];
const energyValues = [
    {
        level: 1,
        energy: 500,
    },
    {
        level: 2,
        energy: 1000,
    },
    {
        level: 3,
        energy: 1500,
    },
    {
        level: 4,
        energy: 2000,
    },
    {
        level: 5,
        energy: 2500,
    },
    {
        level: 6,
        energy: 3000,
    },
    {
        level: 7,
        energy: 3500,
    },
    {
        level: 8,
        energy: 4000,
    },
    {
        level: 9,
        energy: 4500,
    },
    {
        level: 10,
        energy: 5000,
    },
    {
        level: 11,
        energy: 5500,
    },
    {
        level: 12,
        energy: 6000,
    },
    {
        level: 13,
        energy: 6500,
    },
    {
        level: 14,
        energy: 7000,
    },
];

exports.getAllSocialTasks = async (req, res) => {
    try {
        const socialTasks = await SocialModel.find({});
        res.status(200).json({
            status: 'success',
            socialTasks
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        });
    }
};

exports.getAllDailyTasks = async (req, res) => {
    try {
        const dailyTasks = await DailyModel.find({});
        res.status(200).json({
            status: 'success',
            dailyTasks
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        });
    }
};

exports.selection = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findOne({ userId: id });

        if (user) {
            let { day, date } = user.daily_claimed;

            if (date !== "") {
                // Initialize response values
                let value;
                let claimed = [];

                if (check48Hour(date)) {
                    value = { day: 0, reward: 500 };
                    // Update user document
                    await UserModel.updateOne({ userId: id }, {
                        $set: {
                            "daily_claimed": {
                                claimed: [],
                                day: 0,
                                reward: 0,
                                date: "",
                            }
                        }
                    });
                    return res.status(200).json({
                        status: 'success',
                        button: false,
                        value
                    });
                } else {
                    if (check24hour(date)) {
                        if (day === 0) {
                            value = { day: 1, reward: 1000 };
                        } else if (day === 1) {
                            value = { day: 2, reward: 2000 };
                        } else if (day === 2) {
                            value = { day: 3, reward: 5000 };
                        } else if (day === 3) {
                            value = { day: 4, reward: 10000 };
                        } else if (day === 4) {
                            value = { day: 5, reward: 25000 };
                        } else if (day === 5) {
                            value = { day: 6, reward: 50000 };
                        } else {
                            value = { day: 0, reward: 500 };
                            claimed = [];
                            // Reset user document
                            await UserModel.updateOne({ userId: id }, {
                                $set: {
                                    "daily_claimed": {
                                        claimed: [],
                                        day: 0,
                                        reward: 0,
                                        date: "",
                                    }
                                }
                            });
                        }
                        return res.status(200).json({
                            status: 'success',
                            button: false,
                            value
                        });
                    } else {
                        return res.status(200).json({
                            status: 'success',
                            button: true,
                            value: user.daily_claimed
                        });
                    }
                }
            } else {
                return res.status(200).json({
                    status: 'success',
                    button: false,
                    value: { day: 0, reward: 500 }
                });
            }
        } else {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error!'
        });
    }
};

exports.sendUserData = async (req, res) => {
    try {
        const { queryParams, referrerId, isPremium, telegramUser } = req.body;

        if (!telegramUser) {
            return res.status(400).json({
                status: 'failed',
                message: "Telegram user data is required"
            });
        }

        const {
            id: userId,
            username,
            first_name: firstName,
            last_name: lastName,
        } = telegramUser;

        const finalUsername = username || `${firstName}_${lastName}`;

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ userId: userId.toString() });

        if (existingUser) {
            console.log("User already exists in MongoDB");
            // Update referrals (Assuming updateReferrals is a valid function)
            await updateReferrals(existingUser);

            // Send response with user data
            return res.status(200).json({
                status: 'existingUser',
                message: "User already exists",
                userData: existingUser,
            });
        }

        // Prepare user data for new user
        const baseUserData = {
            userId: userId.toString(),
            username: finalUsername,
            firstName,
            lastName,
            totalBalance: 0,
            freeGuru: 3,
            fullTank: 3,
            tapBalance: 0,
            timeSta: null,
            timeStaTank: null,
            daily_claimed: {
                claimed: [],
                day: 0,
                date: "",
                reward: 0,
            },
            claimedReferralRewards: [],
            tapValue: { level: 0, value: 1 },
            timeRefill: { level: 1, duration: 10, step: 600 },
            level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" },
            energy: 500,
            battery: { level: 1, energy: 500 },
            refereeId: referrerId || null,
            referrals: [],
            double_booster: {
                startAt: "",
                rewardTimer: "",
                rewardClaimed: 0,
                rewardStart: false,
            },
            power_tap: {
                startAt: "",
                rewardTimer: "",
                rewardClaimed: 0,
                rewardStart: false,
            },
            announcementReward: {
                link: "",
                status: "notVerified",
                timestamp: null,
            },
            task_lists: [],
            daily_task_lists: [],
            youtube_booster: {
                date: "",
                startAt: "",
                status: false,
                rewardIndex: 0,
                videoWatch: 0,
            },
            twitterUserName: "",
            tonWalletAddress: "",
            createdAt: new Date(), // or serverTimestamp() if using Firebase
        };

        const userData = referrerId
            ? { ...baseUserData, balance: isPremium ? 25000 : 10000 }
            : { ...baseUserData, balance: 0 };

        // Save new user in MongoDB
        const newUser = new UserModel(userData);
        await newUser.save();

        // Update referrer information if available
        if (referrerId) {
            const referrer = await UserModel.findOne({ userId: referrerId });
            if (referrer) {
                referrer.referrals.push({
                    userId: userId.toString(),
                    username: finalUsername,
                    balance: newUser.balance,
                    status: false,
                    isPremium,
                    level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" },
                });
                await referrer.save();
            }
        }

        // Send response with new user data
        res.status(200).json({
            status: 'newUser',
            message: "New user created",
            userData: newUser,
        });
    } catch (error) {
        console.error("Error saving user in MongoDB:", error.message || error);
        res.status(500).json({
            status: 'failed',
            message: "Internal server error",
            error: error.message || error,
        });
    }
};

exports.claimRewardsOfReferals = async (req, res) => {
    const { referrerId, claimList } = req.body;
    try {
        let totalReward = 0;
        // Calculate the total reward
        claimList.forEach((claim) => {
            totalReward += claim.isPremium ? 25000 : 10000;
        });
        // Find the referrer in the MongoDB database
        const referrer = await UserModel.findOne({ userId: referrerId });
        if (referrer) {
            // Update the balance
            const currentBalance = referrer.balance || 0;
            const newBalance = currentBalance + totalReward;
            // Update the user's balance and claim list
            const updatedClaimList = claimList.map((claim) => {
                if (!claim.status) {
                    claim.status = true; // Change status to true
                }
                return claim;
            });
            // Update the referrer document in MongoDB
            await UserModel.updateOne(
                { userId: referrerId },
                {
                    $set: {
                        balance: newBalance,
                        referrals: updatedClaimList,
                    },
                }
            );
            res.status(200).json({
                status: 'success',
                balance: newBalance
            });
        } else {
            res.status(200).json({
                status: 'failed',
                message: "Referrer not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error!"
        });
    }
};

exports.fetchUsersDay = async (req, res) => {
    try {
        const queryValue = req.query.queryValue || ''; // Get queryValue from request query parameters

        // Construct the Mongoose query
        let query = UserModel.find();

        if (queryValue) {
            // Search for usernames starting with queryValue and sort by balance
            query = query
                .where('username').regex(new RegExp('^' + queryValue, 'i')) // Case-insensitive search
                .sort({ balance: -1 }); // Sort by balance descending
        } else {
            // Default sorting by balance if no queryValue
            query = query.sort({ balance: -1 });
        }

        // Limit the results to 100
        query = query.limit(100);

        // Execute the query
        const users = await query.exec();

        // Send the response
        res.status(200).json({
            status: 'success',
            users: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        });
    }
};

exports.fetchUsersWeek = async (req, res) => {
    try {
        const { queryValue } = req.body;

        let query;

        if (queryValue) {
            // Query for matching usernames and sort by balance in descending order
            query = UserModel.find({
                username: { $gte: queryValue, $lte: queryValue + '\uf8ff' }
            }).sort({ balance: -1 });
        } else {
            // If no queryValue, get all users and sort by balance in descending order
            query = UserModel.find().sort({ balance: -1 });
        }

        const users = await query.exec();

        // Respond with the retrieved users
        return res.status(200).json({
            status: 'success',
            users: users
        });
    } catch (error) {
        // Handle errors and send a 500 status with a failure message
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error!'
        });
    }
};

exports.calculateOverallBalance = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await UserModel.find({});

        // Safely extract the balance field and sum it up
        const totalBalance = users.reduce((sum, user) => {
            const balance = user.balance;
            return sum + (balance || 0); // Add balance to sum or 0 if undefined
        }, 0);

        // Return the total balance as a response
        res.status(200).json({
            status: 'success',
            balance: totalBalance
        });
    } catch (error) {
        // Return an error response if something goes wrong
        if (!res.headersSent) {
            res.status(500).json({
                status: 'failed',
                message: "Internal server error"
            });
        }
    }
};


exports.updateTwitterName = async (req, res) => {
    const { id, twitterUserName } = req.body;

    try {
        // Find the user by ID and update their Twitter username
        const user = await UserModel.findByIdAndUpdate(
            id,
            { twitterUserName: twitterUserName },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            user
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Server error'
        });
    }
};

exports.updateAnnouncementLink = async (req, res) => {
    const { id } = req.params; // Get the ID from URL params
    const { announceLink, status } = req.body; // Get announcement details from the request body

    try {
        // Update the announcement with the provided ID
        const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
            id,
            {
                announcementReward: {
                    link: announceLink,
                    status: status,
                    timestamp: new Date(), // Use current date and time as timestamp
                },
            },
            { new: true } // Return the updated document
        );

        if (!updatedAnnouncement) {
            return res.status(200).json({
                status: 'failed',
                message: 'Announcement not found'
            });
        }
        // Send a success response
        res.status(200).json({
            status: 'success',
            updatedAnnouncement
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error!'
        });
    }
};

exports.fetchAnnouncementReward = async (req, res) => {
    try {
        // Find the user by ID
        const { id } = req.body;
        const user = await UserModel.findById(id);

        if (user) {
            const rewardData = user.announcementReward || {
                link: "",
                status: "notVerified",
                timestamp: null,
            };

            if (check24hour(rewardData.timestamp)) {
                // Update the announcementReward field
                await UserModel.findByIdAndUpdate(id, {
                    announcementReward: {
                        link: "",
                        status: "notVerified",
                        timestamp: null,
                    },
                });

                return res.status(200).json({
                    link: "",
                    status: "notVerified",
                    timestamp: null,
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    rewardData
                });
            }
        } else {
            return res.status(200).json({
                status: 'failed',
                link: "",
                status: "notVerified",
                timestamp: null,
            });
        }
    } catch (error) {
        return res.status(200).json({
            status: 'failed',
            link: "",
            status: "notVerified",
            timestamp: null,
        });
    }
};

exports.updateWalletAddress = async (req, res) => {
    try {
        const { userId, walletAddress } = req.body;
        // Find the user by userId and update the wallet address
        const result = await UserModel.findOneAndUpdate(
            { userId: userId }, // Query to find the user
            { tonWalletAddress: walletAddress }, // Update operation
            { new: true, useFindAndModify: false } // Options
        );

        // Return the updated user document (if needed)
        return res.status(200).json({
            status: 'success',
            result
        });
    } catch (error) {
        return res.status(200).json({
            status: 'failed',
            message: "Internal Server Error!"
        });
    }
};

exports.updateReferralsReq = async (req, res) => {
    const { userId } = req.body;

    const result = await updateReferrals(userId);

    // Send the result as a response
    return res.status(result.status === 'success3' ? 200 : 400).json(result);
}

exports.fetchTasks = async (req, res) => {
    try {
        const dailyTasks = await DailyModel.find({});
        const socialTasks = await SocialModel.find({});
        const announcements = await AnnoucementModel.find({});

        const tasksData = {
            dailyTasks,
            socialTasks,
            announcements
        };

        res.status(200).json({
            status: 'success',
            tasksData
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: "Error fetching tasks"
        });
    }
};

exports.fetchUserData = async (req, res) => {
    const { userId } = req.params; // Assuming userId is provided in route parameters

    if (!userId) return res.status(400).json({ error: "User ID is required" });

    try {
        // Fetch user data
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const userData = {
            completedTasks: user.task_lists || [],
            manualTasks: user.daily_task_lists || []
        };

        // Fetch manual tasks (if any)
        const manualTasks = await DailyModel.find({});

        res.status(200).json({
            userData,
            manualTasks
        });
    } catch (error) {
        console.error("Error fetching user data: ", error);
        res.status(500).json({ error: "Error fetching user data" });
    }
};

exports.fetchReferrals = async (req, res) => {
    try {
        const userId = req.params.userId; // Assumes userId is passed as a URL parameter
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Find the user in the database
        const user = await UserModel.findOne({ userId: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send back the referrals list
        res.status(200).json({
            status: 'success',
            referrals: user.referrals || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.fetchAnnouncement = async (req, res) => {
    try {
        const announcement = await AnnoucementModel.findOne({ status: true }).sort({ createdAt: -1 });

        if (!announcement) {
            return res.status(200).json({
                status: 'failed',
                message: "No announcements found with status true!"
            });
        }

        res.status(200).json({
            status: 'success',
            announcement
        });
    } catch (error) {
        console.error("Error fetching announcement:", error);
        res.status(500).json({ message: "Error fetching announcement." });
    }
};

exports.updateUserLevel = async (req, res) => {
    const { userId, newTapBalance } = req.body;
    let newLevel = { id: 1, name: "Bronze", imgUrl: "/bronze.webp" };

    if (newTapBalance >= 1000 && newTapBalance < 50000) {
        newLevel = { id: 2, name: "Silver", imgUrl: "/silver.webp" };
    } else if (newTapBalance >= 50000 && newTapBalance < 500000) {
        newLevel = { id: 3, name: "Gold", imgUrl: "/gold.webp" };
    } else if (newTapBalance >= 500000 && newTapBalance < 1000000) {
        newLevel = { id: 4, name: "Platinum", imgUrl: "/platinum.webp" };
    } else if (newTapBalance >= 1000000 && newTapBalance < 2500000) {
        newLevel = { id: 5, name: "Diamond", imgUrl: "/diamond.webp" };
    } else if (newTapBalance >= 2500000) {
        newLevel = { id: 6, name: "Master", imgUrl: "/master.webp" };
    }

    try {
        // Find the user by userId
        const user = await UserModel.findOne({ userId: userId });

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found!'
            })
        }

        // Check if the level needs to be updated
        if (user.level.id !== newLevel.id) {
            // Update the user's level
            user.level = newLevel;
            await user.save(); // Save the changes

            return res.status(200).json({
                status: 'success',
                message: 'Level Updated Succesfuly!'
            })
        }
    } catch (error) {
        console.error(`Error updating user level: ${error.message}`);
    }
};

exports.checkAndUpdateFreeGuru = async (req, res) => {
    try {
        const { userId } = req.body;
        // Find the user by userId
        const user = await UserModel.findOne({ userId });

        if (user) {
            // Extract the lastDate and format it
            const lastDate = new Date(user.timeSta); // Convert the timeSta string to a Date object
            const formattedDates = lastDate.toISOString().split("T")[0]; // Get the date part in YYYY-MM-DD format

            // Get the current date and format it
            const currentDate = new Date(); // Get the current date
            const formattedCurrentDates = currentDate.toISOString().split("T")[0]; // Get the date part in YYYY-MM-DD format

            if (formattedDates !== formattedCurrentDates && user.freeGuru <= 0) {
                // Update the user's freeGuru and timeSta
                await UserModel.updateOne(
                    { userId },
                    {
                        freeGuru: 3,
                        timeSta: new Date()
                    }
                );

                // You can return a success message or perform other actions
                return res.status(200).json({
                    success: true,
                    freeGuru: 3
                });
            }
        }

        return res.status(200).json({
            success: false,
            message: 'User not found or no update needed'
        })
    } catch (error) {
        console.error('Error updating freeGuru:', error);
        throw new Error('Error updating freeGuru');
    }
};

exports.checkAndUpdateFullTank = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await UserModel.findById(id);

        if (user) {
            // Convert lastDateTank to JS Date
            const lastDateTank = new Date(user.timeStaTank);
            const formattedDate = lastDateTank.toISOString().split("T")[0]; // YYYY-MM-DD
            const currentDate = new Date();
            const formattedCurrentDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD

            if (formattedDate !== formattedCurrentDate && user.fullTank <= 0) {
                // Update the user's fullTank and timeStaTank
                user.fullTank = 3;
                user.timeStaTank = new Date();
                await user.save(); // Save the updated user data

                // Optionally return or handle the updated value
                return res.status(200).json({
                    success: true,
                    fullTank: user.fullTank
                })
            }
        }
        return res.status(200).json({
            success: false,
            fullTank: null
        }) // Return null if user not found or no update needed
    } catch (error) {
        console.error('Error checking and updating full tank:', error);
        return res.status(200).json({
            status: 'failed',
            message: "Internal Server Error!"
        })
    }
};

exports.fetchStartTimeTap = async (req, res) => {
    const { id } = req.params; // Get the ID from request parameters

    try {
        // Find the user by ID
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if rewardTimer exists and is valid
        if (user.double_booster && user.double_booster.rewardTimer) {
            const startTime = new Date(user.double_booster.rewardTimer); // Convert string to Date object
            const currentTime = Date.now();
            const timePassed = currentTime - startTime.getTime(); // Get time difference in milliseconds
            const oneHourInMillis = 1 * 60 * 60 * 1000; // One hour in milliseconds

            if (timePassed >= oneHourInMillis) {
                return res.json({ status: 'success1', startTime: false, doubleBoost: false });
            } else {
                const remainingTime = oneHourInMillis - timePassed;
                return res.json({
                    status: 'success2',
                    startTime: true,
                    timeLeft: Math.floor(remainingTime / 1000), // Time left in seconds
                });
            }
        } else {
            return res.json({ status: 'success3', startTime: false, doubleBoost: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.fetchStartTimePowerTap = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch user from MongoDB
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found'
            });
        }

        if (user.power_tap && user.power_tap.rewardTimer) {
            const startTime = new Date(user.power_tap.rewardTimer);
            const currentTime = Date.now();
            const timePassed = currentTime - startTime.getTime();
            const oneHourInMillis = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

            if (timePassed >= oneHourInMillis) {
                res.json({
                    status: 'success1',
                    startTimePower: false,
                    powerBootStart: false
                });
            } else {
                const remainingTime = oneHourInMillis - timePassed;
                res.json({
                    status: 'success2',
                    startTimePower: true,
                    powerTimeLeft: Math.floor(remainingTime / 1000) // Convert to seconds
                });
            }
        } else {
            res.json({
                status: 'success3',
                startTimePower: false,
                powerBootStart: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateData = async (req, res) => {
    const { userId, balance, energy, tapBalance } = req.body;

    if (!userId || balance === undefined || energy === undefined || tapBalance === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const user = await UserModel.findOneAndUpdate(
            { userId },
            { balance, energy, tapBalance },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.handleClaim = async (req, res) => {
    const { userId, reward, day } = req.body;

    try {
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { daily_claimed } = user;
        const { date, claimed } = daily_claimed;
        const newBalance = user.balance + reward;

        if (date !== "" && !check24hour(date)) {
            return res.status(400).json({ message: 'You have already claimed today\'s reward.' });
        }

        user.balance = newBalance;
        user.daily_claimed = {
            claimed: [...claimed, day],
            day: Number(day),
            reward,
            date: serverTimestamp(), // Adjust this to match your server timestamp implementation
        };

        if (day === 6) {
            user.daily_claimed.claimed = [];
        }

        await user.save();
        res.status(200).json({ message: 'Reward claimed successfully.', user });
    } catch (error) {
        console.error('Error claiming reward:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.verifyTelegram = async (req, res) => {
    const { userId } = req.body;

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${CHAT_ID}&user_id=${Number(userId)}`
        );

        const data = await response.json();

        if (
            data.ok &&
            (data.result.status === 'member' ||
                data.result.status === 'administrator' ||
                data.result.status === 'creator')
        ) {
            res.status(200).json({ isMember: true });
        } else {
            res.status(400).json({ isMember: false, message: 'Not a member of the Telegram channel.' });
        }
    } catch (error) {
        console.error('Error verifying Telegram status:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.claimTask = async (req, res) => {
    const { userId, amount, taskId, image } = req.body;

    try {
        // Telegram-specific verification
        if (image === 'telegram') {
            const response = await fetch(
                `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${CHAT_ID}&user_id=${Number(userId)}`
            );

            const data = await response.json();

            if (
                !data.ok ||
                !(data.result.status === 'member' ||
                    data.result.status === 'administrator' ||
                    data.result.status === 'creator')
            ) {
                return res.status(400).json({ message: 'Please join the Telegram channel first.' });
            }
        }

        const user = await UserModel.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { balance, task_lists = [] } = user;
        const newBalance = balance + Number(amount);

        // Ensure the task has not been claimed yet
        if (!task_lists.includes(taskId)) {
            user.balance = newBalance;
            user.task_lists = [...task_lists, taskId];

            await user.save();
            res.status(200).json({ message: 'Reward has been claimed successfully.', newBalance });
        } else {
            res.status(400).json({ message: 'This task has already been claimed.' });
        }
    } catch (error) {
        console.error('Error claiming task:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.claimDailyTask = async (req, res) => {
    const { userId, amount, taskId } = req.body;

    try {
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { balance, daily_task_lists = [] } = user;
        const newBalance = balance + Number(amount);

        // Ensure the task has not been claimed yet
        if (!daily_task_lists.includes(taskId)) {
            user.balance = newBalance;
            user.daily_task_lists = [...daily_task_lists, taskId];

            await user.save();
            res.status(200).json({ message: 'Reward has been claimed successfully.', newBalance });
        } else {
            res.status(400).json({ message: 'This task has already been claimed.' });
        }
    } catch (error) {
        console.error('Error claiming daily task:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.handleAnnoucement = async (req, res) => {
    const { userId, amount, currentAnnouncementLink, isValidURL } = req.body;

    try {
        if (isValidURL && currentAnnouncementLink !== "") {
            await updateAnnouncementLink(currentAnnouncementLink, "verifying");
            res.status(200).json({ message: "URL saved successfully" });

            // Wait for 20 seconds before verifying
            setTimeout(async () => {
                try {
                    await updateAnnouncementLink(currentAnnouncementLink, "verified");

                    const user = await User.findOne({ userId });

                    if (user) {
                        const { balance, announcementReward } = user;
                        if (announcementReward && announcementReward.status === "verified") {
                            const newBalance = Number(balance) + Number(amount);

                            user.balance = newBalance;
                            await user.save();

                            res.status(200).json({
                                message: "Reward has been claimed successfully!",
                                newBalance,
                            });
                        } else {
                            res.status(400).json({ message: "Announcement reward is not verified." });
                        }
                    } else {
                        res.status(404).json({ message: "User document does not exist." });
                    }
                } catch (rewardError) {
                    console.error("Error during reward claiming: ", rewardError);
                    res.status(500).json({ message: "An error occurred while claiming the reward." });
                }
            }, 20000);
        } else {
            res.status(400).json({ message: "Please enter a valid URL" });
        }
    } catch (error) {
        console.error("Error updating announcement: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.upgrade = async (req, res) => {
    const { userId, balance, tapValue, refBonus } = req.body;

    try {
        const nextLevel = tapValue.level;
        const upgradeCost = upgradeCosts[nextLevel];

        if (nextLevel < tapValues.length && balance + refBonus >= upgradeCost) {
            const newTapValue = tapValues[nextLevel];
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(200).json({
                    status: 'failed',
                    message: 'User not found.'
                });
            }

            user.tapValue = newTapValue;
            user.balance -= upgradeCost;

            await user.save();

            res.status(200).json({
                status: 'success',
                message: `Upgrade is yours! Multitap Level ${newTapValue.level}`,
                newTapValue,
                newBalance: user.balance,
            });
        } else {
            res.status(200).json({
                status: 'failed',
                message: 'Not enough balance or invalid level.'
            });
        }
    } catch (error) {
        console.error('Error updating tap value:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.energyUpgrade = async (req, res) => {
    const { userId, balance, battery, refBonus } = req.body;

    try {
        const nextEnergyLevel = battery.level;
        const energyUpgradeCost = energyUpgradeCosts[nextEnergyLevel];

        if (nextEnergyLevel < energyValues.length && balance + refBonus >= energyUpgradeCost) {
            const newEnergyValue = energyValues[nextEnergyLevel];
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(200).json({
                    status: 'failed',
                    message: 'User not found.'
                });
            }

            user.battery = {
                level: newEnergyValue.level,
                energy: newEnergyValue.energy + 500,
            };
            user.balance -= energyUpgradeCost;
            user.energy = newEnergyValue.energy + 500;

            await user.save();

            res.status(200).json({
                status: 'success',
                message: `Upgrade is yours! Energy limit Level ${newEnergyValue.level}`,
                newEnergyValue,
                newBalance: user.balance,
            });
        } else {
            res.status(200).json({
                status: 'failed',
                message: 'Not enough balance or invalid level.'
            });
        }
    } catch (error) {
        console.error('Error updating energy value:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.fetchStartTime = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { double_booster } = user;
        const startTime = double_booster?.startAt ? new Date(double_booster.startAt) : "";

        if (startTime) {
            const currentTime = Date.now();
            const timePassed = currentTime - startTime.getTime();
            const oneDayInMillis = 24 * 60 * 60 * 1000;

            if (timePassed >= oneDayInMillis) {
                user.double_booster = {
                    startAt: "",
                    rewardTimer: "",
                    rewardStart: false,
                    rewardClaimed: 0,
                };

                await user.save();

                res.status(200).json({
                    message: 'Double booster expired and reset successfully.',
                    currentReward: 0,
                });
            } else {
                res.status(200).json({ message: 'Double booster is still active.' });
            }
        } else {
            res.status(200).json({ message: 'No double booster start time found.' });
        }
    } catch (error) {
        console.error('Error fetching start time:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.fetchStartTimePowerTaps = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { power_tap } = user;
        const startTime = power_tap?.startAt ? new Date(power_tap.startAt) : "";

        if (startTime) {
            const currentTime = Date.now();
            const timePassed = currentTime - startTime.getTime();
            const oneDayInMillis = 24 * 60 * 60 * 1000;

            if (timePassed >= oneDayInMillis) {
                user.power_tap = {
                    startAt: "",
                    rewardTimer: "",
                    rewardStart: false,
                    rewardClaimed: "",
                };

                await user.save();

                res.status(200).json({
                    message: 'Power tap expired and reset successfully.',
                    newPowerIndex: 0,
                });
            } else {
                res.status(200).json({ message: 'Power tap is still active.' });
            }
        } else {
            res.status(200).json({ message: 'No power tap start time found.' });
        }
    } catch (error) {
        console.error('Error fetching power tap start time:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.HandlePowerTap = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found.'
            });
        }

        const { power_tap } = user;

        if (power_tap.rewardClaimed >= 3) {
            return res.status(200).json({
                status: 'failed',
                message: 'Come after 24 hours'
            });
        }

        const rewardTimerExpired = power_tap.rewardTimer && check1hour(power_tap.rewardTimer);
        const startAt = power_tap.startAt || new Date();
        const rewardClaimed = power_tap.rewardClaimed + 1;

        if (rewardTimerExpired || !power_tap.rewardTimer) {
            user.power_tap = {
                rewardStart: true,
                startAt: startAt,
                rewardTimer: new Date(),
                rewardClaimed: rewardClaimed,
            };

            await user.save();

            res.status(200).json({
                status: 'success',
                message: 'You can tap unlimited times for 1 minute',
                newPowerIndex: rewardClaimed,
            });
        } else {
            res.status(200).json({
                status: 'failed',
                message: 'PowerTap already enabled'
            });
        }
    } catch (error) {
        console.error('Error handling power tap:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.HandleSetIndex = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found.'
            });
        }

        const { double_booster } = user;

        if (double_booster.rewardClaimed >= 3) {
            return res.status(200).json({
                status: 'failed',
                message: 'Come after 24 hours'
            });
        }

        const rewardTimerExpired = double_booster.rewardTimer && check1hour(double_booster.rewardTimer);
        const startAt = double_booster.startAt || new Date();
        const rewardClaimed = double_booster.rewardClaimed + 1;

        if (rewardTimerExpired || !double_booster.rewardTimer) {
            user.double_booster = {
                rewardStart: true,
                startAt: startAt,
                rewardTimer: new Date(),
                rewardClaimed: rewardClaimed,
            };

            await user.save();

            res.status(200).json({
                status: 'success',
                message: 'You can tap unlimited times for 1 minute',
                newRewardClaimed: rewardClaimed,
            });
        } else {
            res.status(200).json({
                status: 'failed',
                message: 'Booster already enabled'
            });
        }
    } catch (error) {
        console.error('Error handling double booster:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}






