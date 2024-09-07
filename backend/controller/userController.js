const UserModel = require('../models/userSchema');
const DailyModel = require('../models/dailySchema');
const SocialModel = require('../models/socialSchema');
const AnnoucementModel = require('../models/annoucementSchema');

const { check48Hour, check24hour } = require('../utils/timeCheckUtils');

exports.getAllSocialTasks = async (req, res) => {
    try {
        const socialTasks = await SocialModel.find({});
        res.status(200).json(socialTasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching social tasks', error: error.message });
    }
};

exports.getAllDailyTasks = async (req, res) => {
    try {
        const dailyTasks = await DailyModel.find({});
        res.status(200).json(dailyTasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily tasks', error: error.message });
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
                    return res.status(200).json({ button: false, value });
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
                        return res.status(200).json({ button: false, value });
                    } else {
                        return res.status(200).json({ button: true, value: user.daily_claimed });
                    }
                }
            } else {
                return res.status(200).json({ button: false, value: { day: 0, reward: 500 } });
            }
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
};

exports.sendUserData = async (req, res) => {
    try {
        const queryParams = req.query;
        let referrerId = queryParams.ref ? queryParams.ref.replace(/\D/g, "") : null;
        let isPremium = JSON.parse(queryParams.isPremium);
        const telegramUser = req.body.telegramUser; 

        if (telegramUser) {
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

                // Update referrals
                await updateReferrals(existingUser);

                // Send response with user data
                return res.status(200).json({
                    message: "User already exists",
                    userData: existingUser,
                });
            }

            // Prepare user data for new user
            const userData = {
                userId: userId.toString(),
                username: finalUsername,
                firstName,
                lastName,
                totalBalance: 0,
                balance: isPremium ? 25000 : 10000,
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
                createdAt: new Date(),
            };

            // Save new user in MongoDB
            const newUser = new TelegramUser(userData);
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

                    // Optionally, you can update the referrer’s balance and send it in the response
                }
            }

            // Send response with new user data
            res.status(201).json({
                message: "New user created",
                userData: newUser,
            });
        } else {
            res.status(400).json({ message: "Telegram user data is required" });
        }
    } catch (error) {
        console.error("Error saving user in MongoDB:", error);
        res.status(500).json({ message: "Internal server error" });
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

            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "Referrer not found" });
        }
    } catch (error) {
        console.error("Error claiming rewards:", error);
        res.status(500).json({ success: false, error: error.message });
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
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.fetchUsersWeek = async (req, res) => {
    try {
        let { query } = req.body;

        if (queryValue) {
            query = UserModel.find({
                username: { $gte: queryValue, $lte: queryValue + '\uf8ff' }
            }).sort({ balance: -1 });
        } else {
            query = UserModel.find().sort({ balance: -1 });
        }

        const users = await query.exec();

        // Process users if needed
        // Example: you can return or process the users here
        return res.status(200).json({
            status: 'success',
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Error fetching users');
    }
};

exports.calculateOverallBalance = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await UserModel.find({});
        
        // Log all documents to see their data
        users.forEach((user) => {
            console.log(`Document ID: ${user._id}`, user);
        });

        // Safely extract the balance field and sum it up
        const totalBalance = users.reduce((sum, user) => {
            const balance = user.balance;
            console.log(`Balance for document ${user._id}:`, balance, sum); // Debug log
            return sum + (balance || 0); // Add balance to sum or 0 if undefined
        }, 0);

        console.log("Total Balance:", totalBalance); // Log the total balance

        // Return the total balance as a response
        res.status(200).json({ totalBalance });
    } catch (error) {
        console.error("Error calculating overall balance:", error);
        res.status(500).json({ error: "Internal server error" });
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
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Send a success response
        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.fetchAnnouncementReward = async (req, res) => {
    try {
        // Find the user by ID
        const {id } = req.body;
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
                return res.status(200).json({rewardData});
            }
        } else {
            return res.status(200).json({
                link: "",
                status: "notVerified",
                timestamp: null,
            });
        }
    } catch (error) {
        console.error("Error fetching announcement reward:", error);
        return {
            link: "",
            status: "notVerified",
            timestamp: null,
        };
    }
};

exports.updateWalletAddress = async (req, res) => {
    try {
        const {userId, walletAddress } = req.body;
        // Find the user by userId and update the wallet address
        const result = await UserModel.findOneAndUpdate(
            { userId: userId }, // Query to find the user
            { tonWalletAddress: walletAddress }, // Update operation
            { new: true, useFindAndModify: false } // Options
        );

        // Return the updated user document (if needed)
        return res.status(200).json({result});
    } catch (error) {
        console.error('Error updating wallet address:', error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};

exports.updateReferrals = async (req, res) => {
    try {
        const { userId } = req.body;
        // Find the user by ID
        const user = await UserModel.findOne({ userId });
        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found!'
            });
        }
        
        const referrals = user.referrals || [];

        // Fetch referral details
        const updatedReferrals = await Promise.all(
            referrals.map(async (referralId) => {
                const referral = await UserModel.findOne({ userId: referralId });
                if (referral) {
                    return res.status(200).json({
                        userId: referral.userId,
                        balance: referral.balance,
                        level: referral.level,
                    });
                }
                return res.status(200).json({ 
                    userId: referralId 
                });
            })
        );

        // Update the user document with updated referrals
        await UserModel.updateOne({ userId }, { referrals: updatedReferrals });

        // Calculate referrer bonus
        const totalEarnings = updatedReferrals.reduce(
            (acc, curr) => acc + (curr.balance || 0),
            0
        );
        const refBonus = Math.floor(totalEarnings * 0.1);
        const totalBalance = user.totalBalance + refBonus;

        // Update user document with refBonus and totalBalance
        await UserModel.updateOne(
            { userId },
            { $set: { refBonus, totalBalance } }
        );

        console.log("Referrer bonus updated in database");
        console.log("Your balance is:", totalBalance);
        return res.status(200).json({
            status: 'success',
            balance: totalBalance
        })
    } catch (error) {
        console.error("Error updating referrer bonus:", error);
    }
};

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

        res.status(200).json(tasksData);
    } catch (error) {
        console.error("Error fetching tasks: ", error);
        res.status(500).json({ error: "Error fetching tasks" });
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
        res.status(200).json({ referrals: user.referrals || [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.fetchAnnouncement = async (req, res) => {
    try {
        const announcement = await AnnoucementModel.findOne({ status: true }).sort({ createdAt: -1 });

        if (!announcement) {
            return res.status(404).json({ message: "No announcements found with status true!" });
        }

        res.status(200).json(announcement);
    } catch (error) {
        console.error("Error fetching announcement:", error);
        res.status(500).json({ message: "Error fetching announcement." });
    }
};

exports.updateUserLevel = async (req, res) => {
    const {userId, newTapBalance} = req.body;
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
            throw new Error('User not found');
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
                    success: true, freeGuru: 3 
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
                    fullTank: user.fullTank
                })            }
        }
        return res.status(200).json({
            fullTank: null
        }) // Return null if user not found or no update needed
    } catch (error) {
        console.error('Error checking and updating full tank:', error);
        throw error; // Rethrow error for handling in higher levels
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
                return res.json({ startTime: false, doubleBoost: false });
            } else {
                const remainingTime = oneHourInMillis - timePassed;
                return res.json({
                    startTime: true,
                    timeLeft: Math.floor(remainingTime / 1000), // Time left in seconds
                });
            }
        } else {
            return res.json({ startTime: false, doubleBoost: false });
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
        const user = await UserModel.findOne({ userId: id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.power_tap && user.power_tap.rewardTimer) {
            const startTime = new Date(user.power_tap.rewardTimer);
            const currentTime = Date.now();
            const timePassed = currentTime - startTime.getTime();
            const oneHourInMillis = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

            if (timePassed >= oneHourInMillis) {
                res.json({
                    startTimePower: false,
                    powerBootStart: false
                });
            } else {
                const remainingTime = oneHourInMillis - timePassed;
                res.json({
                    startTimePower: true,
                    powerTimeLeft: Math.floor(remainingTime / 1000) // Convert to seconds
                });
            }
        } else {
            res.json({
                startTimePower: false,
                powerBootStart: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


