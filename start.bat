@echo off
(
  npm install
  npm run inline
  npm run uglify-sw
  start chrome "http://localhost:7000"
  npm run start
)
