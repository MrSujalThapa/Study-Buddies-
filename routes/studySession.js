const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const study = require('../controllers/studySessions');
const { isLoggedIn, validateSession, isAuthor } = require('../middleware');
const Study = require('../models/study');

// Corrected route
router.route('/studySession')
    .get(isLoggedIn, study.index);

router.route('/newStudySession')
    .get(isLoggedIn, study.newSession)
    .post(isLoggedIn, validateSession, catchAsync(study.createNewSession));

router.route('/studySession/:id') // Fixed missing '/' here
    .get(catchAsync(study.showSession))
    .post(catchAsync(study.joinSession))
    .delete(isLoggedIn, isAuthor, study.deleteSession)

    router.route('/studySession/:id/leave')
    .post(isLoggedIn, study.leaveSession);

module.exports = router;
