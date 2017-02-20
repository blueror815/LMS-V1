# primary-api

This is the script for getting, extracting and storing data to mongodb from Hubspot API.

# Technology Used

This app uses node.js for mobile and web front end side.

# Set up

1. setup node.js

	You will be able to setup node by downloading node.dmg file from here
	
	http://nodejs.org/ 

	After downloading .dmg file and install it.
	This will setup node.js for your machine

2. setup mongoDB 
	
	You will be install mongodb by this command on console.

	$ brew install mongodb

	This will setup mongodb on your machine

	The alternative way to install mongodb is downloading .dmg file and install it.
	You will be able to download it form here.

	http://www.mongodb.org/downloads

3. npm install
	
	Naviagte to root directory and npm install.
	This will setup all node module and dependencies based on package.json file

# Run Project 

1. Run mongodb.

	Navigate to where mongodb is installed and run following command.

	$ sudo mongod

	This will run mongodb on your local.
	The port for mongodb is 27104.

2. Run server.
	
	Navigate project and root directory, run this command.

	$ sudo npm start

	This will run bin/www start script based on package.json

# Hosting on Heroku 
