@echo off
(
  npm install
  npm run inline
  start chrome "http://localhost:7000"
  npm run start
)
