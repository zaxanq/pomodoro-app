Live @ http://kosmowski.ct8.pl/pomodoro-app/
# pomodoro-app

Pomodoro-app is a simple HTML5 + Sass + vanilla JS application that gives user ability to control and improve time spending by selecting how much time should he or she spend on a task and how long the break between tasks should be.
Additional technologies used: Gulp, NPM, Material Icons.

## Installation

Since app is supposed to be simple, the only commands needed after cloning the repo is:
```
npm install
```
To install required packages, and then
```
npm start
```
To start the application.

The **npm start** script pulls master branch to see if there is any update and then starts **gulp watch** script, which will automatically open the app in your browser and additionally it will provide automatization in code modification.

## Usage

To start using the app you need to click the **Start** button. Before that you can change the session and/or break time.
You can do that by using *+1/-1/+10/-10* buttons or by clicking on the value to open number input. Then you can click **OK** button or press Enter.

For less powerful devices there is an option of disabling animated clock circle in the top left corner of the app.

You can advance to another break or session by clicking corresponding button *Session* or *Break*.

App is using **localStorage** to store the session/break times that you have chosen so you don't need to set them each time you use it.

Maximum time allowed is **240 minutes** (4 hours). It is also allowed to set break time to 0 minutes (though why use the app at all then?), but it is forbidden to set session time to 0.
The time can only be expressed in the number of minutes. There is no possibility to set timer to i.e. 30 seconds.