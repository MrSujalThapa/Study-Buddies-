const { sessionSchema } = require('./schemas.js'); 
const ExpressError = require('./utils/ExpressError');
const StudySession = require('./models/study');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateSession = (req, res, next) => {
    const { error } = sessionSchema.validate(req.body);
    console.log(req.body); // Log to verify structure
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const studySessions = await StudySession.findById(id); // Correct model reference
    if (!studySessions) {
        req.flash('error', 'Cannot find that session!');
        return res.redirect('/studySession');
    }
    if (!studySessions.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/studySession/${id}`);
    }
    next();
};