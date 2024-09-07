const express = require('express');
const router = express.Router();

const {
    getAllSocialTasks,
    getAllDailyTasks,
    selection,
    sendUserData,
    claimRewardsOfReferals,
    fetchUsersDay,
    fetchUsersWeek,
    calculateOverallBalance,
    updateTwitterName,
    updateAnnouncementLink,
    fetchAnnouncementReward,
    updateWalletAddress,
    updateReferrals,
    fetchTasks,
    fetchUserData,
    fetchReferrals,
    fetchAnnouncement,
    updateUserLevel,
    checkAndUpdateFreeGuru,
    checkAndUpdateFullTank,
    fetchStartTimeTap,
    fetchStartTimePowerTap
} = require('../controller/userController');


// Get all social tasks
router.get('/social-tasks', getAllSocialTasks);

// Get all daily tasks
router.get('/daily-tasks', getAllDailyTasks);

// Selection endpoint
router.get('/selection/:id', selection);

// Send user data
router.post('/send-user-data', sendUserData);

// Claim rewards of referrals
router.post('/claim-rewards', claimRewardsOfReferals);

// Fetch users for the day
router.get('/fetch-users-day', fetchUsersDay);

// Fetch users for the week
router.post('/fetch-users-week', fetchUsersWeek);

// Calculate overall balance
router.get('/calculate-overall-balance', calculateOverallBalance);

// Update Twitter name
router.post('/update-twitter-name', updateTwitterName);

// Update announcement link
router.put('/update-announcement-link/:id', updateAnnouncementLink);

// Fetch announcement reward
router.get('/fetch-announcement-reward/:id', fetchAnnouncementReward);

// Update wallet address
router.put('/update-wallet-address', updateWalletAddress);

// Update referrals
router.put('/update-referrals/:userId', updateReferrals);

// Fetch tasks
router.get('/fetch-tasks', fetchTasks);

// Fetch user data
router.get('/fetch-user-data/:userId', fetchUserData);

// Fetch referrals
router.get('/fetch-referrals/:userId', fetchReferrals);

// Fetch announcement
router.get('/fetch-announcement/:id', fetchAnnouncement);

// Update user level
router.put('/update-user-level/:userId', updateUserLevel);

// Check and update free guru
router.put('/check-update-free-guru/:userId', checkAndUpdateFreeGuru);

// Check and update full tank
router.put('/check-update-full-tank/:id', checkAndUpdateFullTank);

// Fetch start time tap
router.get('/fetch-start-time-tap/:id', fetchStartTimeTap);

// Fetch start time power tap
router.get('/fetch-start-time-power-tap/:id', fetchStartTimePowerTap);



module.exports = router;