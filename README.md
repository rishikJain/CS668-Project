# Project Abstract
This project served as the semester project for CS668

In this project, we aim to analyze a system of different components like PCs, routers, switches, servers, databases etc. to come up with a system risk score and a possible list of controls. We then simulate applying these controls on assets to come up with a reduced risk score.

We analyze the assets according to there CPE names and fetch the corresponding CVEs from the NIST database using public APIs. Each asset can have multiple CVEs and based on the CVEs, we find the threats for those assets, the corresponding mitigations and list them in the most effective manner which can reduce the overall system risk score.


# Project Structure
This project contains 3 parts
1. Backend 
2. Frontend
3. Assesment model and datasets

## Backend
NodeJS and MongoDB have been used in the backend. To run,
```
git clone <repo>
cd backend
npm i
npm start
```

## Frontend
Frontend is designed using ReactJS.
After starting the backend server, to run the application,
```
cd frontend
npm i
npm start
```
You should see the running application in your browser.


Documentation for the project APIs is available on 
`https://documenter.getpostman.com/view/2804921/2s8YmSrfT5`

## Database
We are using the MongoDb Database that is currently hosted on remote linux machine.

Current Database is structured in the following format
<img width="253" alt="Screenshot 2022-11-20 at 11 49 18 AM" src="https://user-images.githubusercontent.com/15656052/202888824-8414212c-7c1d-43e6-b77b-075a2d4adf40.png">

All the assests that are being saved in the collection are in the following format.
<img width="987" alt="Screenshot 2022-11-20 at 11 51 16 AM" src="https://user-images.githubusercontent.com/15656052/202888853-929edcb1-05fc-4404-aa1e-efa8dee89b89.png">

## Assesment model and datasets
Datasets contains the mappings for CVE and MITRE ATT&CK (tactics and techniques), threats and probabilities, threats and mitigations.
For formulae related to risk calculation, please refer to `Risk Assessment Model.pdf`

<!-- # Getting Started with Frontend for Application


1. Redirect to /frontend directory inside the repo and run the following command.
 `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


** The application doesnt needs to run the backend server locally, as all the APIs are being run on the remote server at 18.191.203.136 








This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify) -->

