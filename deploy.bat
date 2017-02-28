@echo off 
(
  npm run inline
  firebase deploy
  start chrome "https://firebrand.run/"
)