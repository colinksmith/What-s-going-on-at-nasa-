# My Awesome Project
A small website that takes data fromNASA API's, and showing that data in a fun and interesting way. It links to the astronomy picture of the day, EPIC's global photos of earth, and recent rover photos from the Curiosity rover. An emphasis is placed on the most recent imagery, as I don't think it's well known that NASA publishes new photos almost daily.

**Link to project:** http://recruiters-love-seeing-live-demos.com/

![alt tag](http://placecorgi.com/1200/650)

## How It's Made:

**Tech used:** HTML, CSS, SASS, JavaScript, NASA API

A landing page directs the user to one of 3 different pages, each using the API with a format to show recent as well as historical images. Lots of JavaScript puts event listners on many buttons to control what data is being fetched from NASA's API's, and displaying that information on screen, while holding that information in an object running client side to reduce requests made to NASA's servers. Each separate page uses a different API with it's own endpoints and documentation. 

This project was a great exercise in object oriented programming, as I found that organizing each page's Javascript in this way helped minimize passing arguments into funcitons, and reusing the same variables without having to pass and rename them. The similar structure of each page helped some of the code written for the first pages flow cleanly into the next.

A simple template was used for the base of the front-end, and using flexbox and standard CSS to style it. Though it was not made for mobile, it would not be difficult to add some styling and make it mobile friendly.

## Things I would do differently

Some of the API's are missing data on specific dates, but it's difficult to figure out what dates those are and how to skip past them without throwing errors and generally bogging down the user experience. Obviously a back-end could make a list and only use valid dates, but I wanted to make this a static site that only took from NASA's API's. To solve this, one funciton in particular acted recursively, calling itself 7 times and returning the first valid date when getting data from 1 day in the past. It works great for when there's 1 or 2 days missing data, but it hangs for a second or two when there's no valid data in any of the 7 returns. I'd instead have it async all the promises so it pulls the data simultaneously, and then look over the data in totality, but I'd decided to be done with the project before implementing it.

I'd have loved to implement some keyboard events to change photos, especially on the rovers since the irregular size of the photos makes clicking the left/right image button tedious. Similarly, I'd like to make the images loop so that the "left" of image 0 would loop back to the last image.

Some of the styling could be improved of course, but that wasn't the goal of this project for me. 

## Lessons Learned:

I definitely felt like I learned how powerful public API's are, and how much fun infomation you can get from what's out there, right now, for free. And yet I also found the limitations of it, sometimes there was just 1 or 2 things about the data that I wish there were to make it a little more interesting, or some info would be in one endpoint but not another and the data was organized differently so it was challenging to access that information without working with a completely different object. It showed me how powerful a back-end and using one's own data can be, and how it can simplify many things on the front end.

As I mentioned before I feel I got more skilled in object oriented programming throughout this project. I noticed repeating patterns, and if I really wanted to, I could probably reorganize the whole thing as a few classes and subclasses to really make the code readable and satisfying to see execute. I see the potential for it in a much bigger way now. 

