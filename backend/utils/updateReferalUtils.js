const UserModel = require('../models/userSchema');

const updateReferrals = async (userId) => {
    try {
        // Find the user by ID
        const user = await UserModel.findOne({ userId });
        if (!user) {
            return {
                status: 'failed',
                message: 'User not found!'
            };
        }

        const referrals = user.referrals || [];

        // Fetch referral details
        const updatedReferrals = await Promise.all(
            referrals.map(async (referralId) => {
                const referral = await UserModel.findOne({ userId: referralId });
                if (referral) {
                    return {
                        status: 'success1',
                        userId: referral.userId,
                        balance: referral.balance,
                        level: referral.level,
                    };
                }
                return {
                    status: 'success2',
                    userId: referralId
                };
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
        
        return {
            status: 'success3',
            balance: totalBalance
        };
    } catch (error) {
        console.error("Error updating referrer bonus:", error);
        return {
            status: 'error',
            message: 'An error occurred while updating referrer bonus.'
        };
    }
};

module.exports = { updateReferrals };
