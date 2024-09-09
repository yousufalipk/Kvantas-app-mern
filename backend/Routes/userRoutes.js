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
    updateReferralsReq,
    fetchTasks,
    fetchUserData,
    fetchReferrals,
    fetchAnnouncement,
    updateUserLevel,
    checkAndUpdateFreeGuru,
    checkAndUpdateFullTank,
    fetchStartTimeTap,
    fetchStartTimePowerTap,
    updateData,
    handleClaim,
    verifyTelegram,
    claimDailyTask,
    handleAnnoucement,
    upgrade,
    energyUpgrade,
    fetchStartTime,
    fetchStartTimePowerTaps,
    HandlePowerTap,
    HandleSetIndex,
    claimTask
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
router.put('/update-referrals/:userId', updateReferralsReq);  

// Fetch tasks
router.get('/fetch-tasks', fetchTasks);

// Fetch user data
router.get('/fetch-user-data/:userId', fetchUserData);

// Fetch referrals
router.get('/fetch-referrals/:userId', fetchReferrals);

// Fetch announcement
router.get('/fetch-announcement/:id', fetchAnnouncement);

// Update user level
router.put('/update-user-level', updateUserLevel);

// Check and update free guru
router.put('/check-update-free-guru', checkAndUpdateFreeGuru);

// Check and update full tank
router.put('/check-update-full-tank', checkAndUpdateFullTank);

// Fetch start time tap
router.get('/fetch-start-time-tap/:id', fetchStartTimeTap);

// Fetch start time power tap
router.get('/fetch-start-time-power-tap/:id', fetchStartTimePowerTap);

// Update Data 
router.put('/update-data', updateData);

// Update Data for rewards claim
router.post('/claim', handleClaim);

// Verify Telegram
router.post('/verify-telegram', verifyTelegram);

// Claim Task
router.post('/claim-task', claimTask);

// Claim Daily Task
router.post('/claim-daily-task', claimDailyTask);

// Claim Daily Task
router.post('/handle-announcement', handleAnnoucement);

// upgrade
router.post('/upgrade', upgrade);

// upgrade energy
router.post('/energy-upgrade', energyUpgrade);

// Fetch Start Time
router.post('/fetch-start-time', fetchStartTime);

// Fetch Start Time
router.post('/fetch-start-time-power-tap', fetchStartTimePowerTaps);

// Handle Power Tap
router.post('/handle-power-tap', HandlePowerTap);

// Handle Power Tap
router.post('/handle-set-index', HandleSetIndex);



module.exports = router;