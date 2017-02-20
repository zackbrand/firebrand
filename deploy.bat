@echo off 
(
  npm run inline
  firebase deploy
  start chrome "https://firebrand-2a88e.firebaseapp.com/"
)