To create the server and handle http requests/routing I used Node.js and Express.js. I created authentication from scratch by using passport.js, js, session cookies, and joi to create the schema, 
middleware to validate registration/login, and authorize users - from there the data was sent back and stored in the mongoDB database. Once a user inputs their program and semester, 
I used a web-scraping library called puppeteer to extract all the courses from their respective program. From there a user can view active sessions - what course is being studied, who created it, 
who is currently in the study session, the time it’s taking place, it’s location, and choose whether to join or leave a study session. I used ejs for the html template, bootstrap and my own styling, 
as well as flash to make the UI/UX very appealing. They can then create a new study session if they are logged in and delete it if they are the user. 
Additionally middleware and protected routing were implemented so that even if a person tries to send requests through postman they have to be properly validated.


![Screenshot 2024-09-17 231846](https://github.com/user-attachments/assets/e193d663-1363-4e26-8261-5f901be13d60)


## Setup:
```sh
git clone https://github.com/MrSujalThapa/Study-Buddies.git
```
or alternatively, download the repository as a zip.

Developer environment setup:
```sh
npm install
```

What's next for Studdy Buddies:
A dashboard so that a user can see what sessions they are currently in, friends they have made, statistic on how many sessions they joined in the past, awards based on their activity, etc. 
A method for creating online study sessions so that the website can become more accessible - however many safety features and precautions have to be implemented for this to work correctly. 
Expand the web-scraper to be implemented for all university students because at the moment it’s only usable for Waterloo engineering students.

Pitch:https://www.youtube.com/watch?v=-IvyGUuWHbU&ab_channel=SujalThapa

hosted APP: https://study-buddies-zgap.onrender.com/
