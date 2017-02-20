@echo off 
(
  npm run inline
  npm run uglify-sw
  firebase deploy
  start chrome "https://firebrand-2a88e.firebaseapp.com/"
)