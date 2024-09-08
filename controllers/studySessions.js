const StudySession = require('../models/study'); // Ensure the model is imported correctly
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const studySessions = await StudySession.find({})
        .populate('joined', 'username') // Ensure to only populate the 'username' field from the User model
        .populate('author', 'username'); // Populate the author details
    console.log(studySessions);
    res.render('studySession/index', { studySessions });
};

module.exports.newSession = async (req, res) => {
    const courses = req.user.courses;
    res.render('studySession/newSession', { courses });
};

module.exports.createNewSession = async (req, res) => {
    console.log(req.body); // Log to verify structure
    const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });
    const newSessions = new StudySession({
        title: req.body.title,
        location: req.body.location,
        time: req.body.time,
        course: req.body.course,
        description: req.body.description,
        geometry: geoData.features[0].geometry,
        author: req.user._id,
        joined: [req.user._id]
    });
    req.user.sessionsAttended = (req.user.sessionsAttended || 0) + 1;
    await req.user.save();
    await newSessions.save();
    console.log(newSessions);
    req.flash('success', 'Successfully created a new study session!');
    res.redirect(`/studySession/${newSessions._id}`);
};

module.exports.showSession = async (req, res) => {
    const studySessions = await StudySession.findById(req.params.id)
        .populate('joined', 'username')  // Populates the 'joined' array with 'username' only
        .populate('author', 'username'); // Populates the 'author' field with 'username'
    
    if (!studySessions) {
        req.flash('error', 'Cannot find that session!');
        return res.redirect('/studySession');
    }
    console.log(studySessions)
    res.render('studySession/showSession', { studySessions });
};


module.exports.joinSession = async (req, res) => {
    console.log(req.params) 
    const studySessions = await StudySession.findById(req.params.id);
    if (!studySessions) {
        req.flash('error', 'Cannot find that session!');
        return res.redirect('/studySession');
    }

    if (!studySessions.joined.includes(req.user._id)) {
        studySessions.joined.push(req.user._id); // Add current user's ID to the joined array
        await studySessions.save();
        req.user.sessionsAttended = (req.user.sessionsAttended || 0) + 1;
        await req.user.save();
        req.flash('success', 'Successfully joined the study session!');
    } else {
        req.flash('error', 'You have already joined this session!');
    }
    console.log(studySessions)
    res.redirect(`/studySession/${studySessions._id}`);
};


module.exports.leaveSession = async (req, res) => {
    const studySessions = await StudySession.findById(req.params.id);
    if (!studySessions) {
        req.flash('error', 'Cannot find that session!');
        return res.redirect('/studySession');
    }

    // Remove the user from the joined array
    studySessions.joined = studySessions.joined.filter(userId => !userId.equals(req.user._id));

    req.user.sessionsAttended = req.user.sessionsAttended - 1 || 0; // Decrement user's sessions attended count
    await studySessions.save();
    await req.user.save();

    req.flash('success', 'You have left the study session.');
    res.redirect(`/studySession/${studySessions._id}`);
};


module.exports.deleteSession = async (req, res) => {
    const { id } = req.params;

    // Ensure only the author can delete the session
    const studySessions = await StudySession.findById(id); // Correct model name here
    if (!studySessions) {
        req.flash('error', 'Cannot find that session!');
        return res.redirect('/studySession');
    }

    if (!studySessions.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to delete this session.');
        return res.redirect(`/studySession/${id}`);
    }

    await StudySession.findByIdAndDelete(id); // Correct model name
    req.flash('success', 'Study session successfully deleted.');
    res.redirect('/studySession');
};
