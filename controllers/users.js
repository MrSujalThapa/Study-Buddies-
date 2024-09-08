const User = require('../models/user');

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


const puppeteer = require('puppeteer');

async function scrapeCourses(program) {
    const url = `https://uwaterloo.ca/future-students/programs/${program}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the page and wait for full content to load
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the ul element to ensure the content is loaded
    try {
        await page.waitForSelector('.uw-copy-text__wrapper ul', { timeout: 30000 });
    } catch (error) {
        console.error('Error waiting for selector:', error);
        await browser.close();
        return [];
    }

    // Extract and process the content of each li element
    const courses = await page.evaluate(() => {
        // Select the ul element
        const ulElement = document.querySelector('.uw-copy-text__wrapper ul');
        if (!ulElement) {
            console.error('ul element not found!');
            return [];
        }

        // Get all li elements and return their innerHTML
        const liElements = ulElement.querySelectorAll('li');
        return Array.from(liElements).map(li => {
            const content = li.innerHTML;
            const parts = content.split('–');
            return {
                title: parts.length > 1 ? parts[1].trim() : '' // Keep only the part after the hyphen
            };
        }).filter(course => course.title); // Remove any courses with empty titles
    });

    await browser.close();
    return courses;
}
