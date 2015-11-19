### Requirements:

*  io.js (1.6.*)
*  Bower
*  Gulp

### Installation Guide
```bash
git clone https://github.com/SomeHero/buzz-web
cd ./buzz-web
npm install 
bower install
gulp install
```

### Development
To run app with DEBUG:
```bash
DEBUG=buzz-web:* node ./server.js
```
To automatically run app with debug you should do this:
open ~/.bashrc
and put this at the very end
```
export DEBUG=buzz-web: *
```
then relogin and use following command to run app
```bash
node ./server.js
```

To automatically recompile sources during development run:
```bash
gulp watch
```


Gulp tasks available:

 name | description
 --- | ---
js | Compile JS
js-app | Concat and minify all application scripts
js-libs | Concat and minify 3rd parties scripts
less | Compile LESS
jade | Compile JADE
copy-fonts | Copy fonts into `/dist/fonts`
copy-images | Copy images into `/dist/images`
install | Run all tasks above
clean | Removing './dist' directory


All environmental variables storing in .env file in root directory. You should create new and ask someone for variables.

### .env example
```
TWITTER_ID              = ID
TWITTER_SECRET          = SECRET
TWITTER_URI             = URI

FACEBOOK_ID             = ID
FACEBOOK_SECRET         = SECRET
FACEBOOK_URI            = URI
```
