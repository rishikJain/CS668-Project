# Project Abstract
This project is build for semester project for CS-668

In project we aim to analyze a system, a system can be group of different components including like Personnel Computer, LAN , routers etc.
We analyze these assets according to there CPE names and fetch the corresponding CVEs from the NIST database with there public API
For example CPE names for each asset is 
`cpe:2.3:a:microsoft:powerpoint:-:*:*:*:*:*:*:*`

Each component of the whole system can have multiple CVEs and based on that CVEs we find the threats for those components and then we try to find the corresponding mitigations and list them out in the most effective manner which can reduce the overall system risk score.


# Project Structure
This project contains 3 parts
1. Frontend 
2. Backend
3. Assesment model and datasets

## Frontend
Frontend is build using reactJs technology which consumes the APIs from backend. Based on the data from the APIs we update the details on the UI

## Backend
Backend part is build using NodeJs and database we have used is MongoDB, which is hosted on remote server on linux machine.

Documentation for the project APIs is available on 
`https://documenter.getpostman.com/view/2804921/2s8YmSrfT5`

## Database
We are using the MongoDb Database that is currently hosted on remote linux machine.

Current Database is structured in the following format
<img width="253" alt="Screenshot 2022-11-20 at 11 49 18 AM" src="https://user-images.githubusercontent.com/15656052/202888824-8414212c-7c1d-43e6-b77b-075a2d4adf40.png">

All the assests that are being saved in the collection are in the following format.
<img width="987" alt="Screenshot 2022-11-20 at 11 51 16 AM" src="https://user-images.githubusercontent.com/15656052/202888853-929edcb1-05fc-4404-aa1e-efa8dee89b89.png">

## Assesment model and datasets
Datasets contains the list of CVEs and there corresponding vulnerabilites and the map for probability of the vulnerabilities, which are used to fetch the threats corresponding to there CVEs.

# Getting Started with Frontend for Application


1. Redirect to /frontend directory inside the repo and run the following command.
 `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


** The application doesnt needs to run the backend server locally, as all the APIs are being run on the remote server at 18.191.203.136 







