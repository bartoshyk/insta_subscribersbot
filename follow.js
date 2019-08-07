var webdriver = require('selenium-webdriver'),
 by = webdriver.By,
 Promise = require('promise'),
 settings = require('./settings.json');
var log4js = require('log4js'); 

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('bot.log'), 'instabot');
var logger = log4js.getLogger('instabot');
logger.setLevel('DEBUG');


var xpathExit = '/html/body/div[3]/div/div/div/button[6]';
var xpathUserMenu = '//*[@id="react-root"]/section/main/div/header/section/div[1]/div/button/span';
var xpathFollowUserOpen = '//*[@id="react-root"]/section/main/div/header/section/div[1]/div[1]/span/span[1]/button';
var xpathLoginButton = '//*[@id="react-root"]/section/main/div/article/div/div[1]/div/form/div[4]/button';

var browser = new webdriver
.Builder()
.withCapabilities(webdriver.Capabilities.firefox())
.build();

browser.manage().window().setSize(1024, 700);


var randomInteger = function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
browser.sleep(randomInteger(5000, 8000));


for(var bot of settings.accauntsBots) {
    signIn(bot)
        .then(() => {
            logger.info('Logged in ' + bot.botLogin + "!");
            followUsers(settings.accauntsForLikes)
            .then(() => {
                logger.info('Logged in ' + bot.botLogin + "!");
                signOut(bot.botLogin);
            })
            .catch();
        })
        .catch();
}


function followUsers(users) {
    users.forEach(user => {
        browser.get('https://www.instagram.com/' + user)
            .then(()=> logger.info('I work with ' + user));
        browser.sleep(randomInteger(7000, 8000));
        browser.findElement(by.xpath(xpathFollowUserOpen)).click()
            .then(()=> logger.info('Ready with ' + user))
            .catch(error => logger.error('Oops :( ' + user));
        browser.sleep(randomInteger(7000, 8000));
    });
        return browser.sleep(randomInteger(5000, 8000));
}


function signIn(bot) {

    browser.get('https://www.instagram.com/accounts/login/');
    browser.sleep(randomInteger(5000, 8000));
    browser.findElement(by.name('username')).sendKeys(bot.botLogin);
    browser.sleep(randomInteger(5000, 8000));
    browser.findElement(by.name('password')).sendKeys(bot.botPass);
    browser.findElement(by.xpath(xpathLoginButton)).click();
    return browser.sleep(randomInteger(15000, 20000));
};

 
function signOut(botLogin) {
    console.log('Sign out ', bot.botLogin);    
    browser.get('https://www.instagram.com/' + botLogin);
    browser.sleep(randomInteger(5000, 7000));
    browser.findElement(by.xpath(xpathUserMenu)).click();
    browser.sleep(randomInteger(1000, 1000));
    browser.findElement(by.xpath(xpathExit)).click();
    browser.sleep(randomInteger(5000, 8000));
};




