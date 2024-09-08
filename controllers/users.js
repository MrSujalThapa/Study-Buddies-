const User = require('../models/user');

const puppeteer = require('puppeteer');

module.exports.renderRegister = (req, res) => {
    res.render('users/register'); 
}

module.exports.success = (req, res) => {
    res.render('users/success'); 
}



module.exports.register = async (req, res, next) => {
    try {
        const { email, username, program, semester, password } = req.body;

        // Scrape courses and ensure it returns an array of objects
        const courses = await scrapeCourses(program);  
        console.log('Courses:', courses); // Log the array to see what data is returned

        // Create a new user with the scraped courses
        const user = new User({
            email,
            username,
            program,
            semester,
            courses
        });
        console.log('User:', user); // Log user to ensure the correct data is being saved

        // Register the user with the password
        const registeredUser = await User.register(user, password);

        // Log in the user
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Study Buddy!');
            res.redirect('/studySession'); 
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/studySession';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
}


async function scrapeCourses(program) {
    const url = `https://uwaterloo.ca/future-students/programs/${program}`;

    // Launch Puppeteer without specifying executablePath
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for cloud environments like Render
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the ul element to load
    await page.waitForSelector('.uw-copy-text__wrapper ul');

    // Extract and return the courses
    const courses = await page.evaluate(() => {
        const ulElement = document.querySelector('.uw-copy-text__wrapper ul');
        if (!ulElement) return [];

        const liElements = ulElement.querySelectorAll('li');
        return Array.from(liElements).map(li => {
            const content = li.innerHTML;
            const parts = content.split('–');
            return {
                title: parts.length > 1 ? parts[1].trim() : ''
            };
        }).filter(course => course.title);
    });

    await browser.close();
    return courses;
}
