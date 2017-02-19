@echo on
  
	IF NOT EXIST "node_modules\" (npm install)
    start chrome "http://localhost:7000"
    npm run start
