@ECHO OFF
cd frontend
call npm install
cd ../backend
call npm install
cd ..
call npm install
PAUSE