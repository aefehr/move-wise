# Move Wise
![image](https://github.com/user-attachments/assets/a9a47b63-e854-44d2-887f-5d04a50faa72)
<img width="1059" alt="Screenshot 2024-09-22 at 4 01 55 PM" src="https://github.com/user-attachments/assets/65d0b631-5b9d-4edc-a7f5-95fb94a9c3df">

This application is intended to provide useful information for users looking to move to a new location in search for a new job. MoveWise is a comprehensive application that integrates company performance data, city cost of living metrics, and real estate insights across U.S. regions, designed to empower job seekers in making informed relocation decisions.

## Technology

Frontend implemented using React (vite), backend server using NodeJS and express. The database uses an AWS hosted instance of MySQL.

## How to run

1. Start the backend
- Open a terminal in the root folder and run `cd server`
- Install required packages by running `npm install` or `npm i`
- Start the backend server with `npm run start`

2. Start the frontend
- Open a terminal in the root folder and run `cd client`
- Install required packages by running `npm install` or `npm i`
- Start the frontend with `npm run dev`

## Folder structure

- data: contains all dataset processing IPython notebooks used to preprocess the data
- server: contains all backend files
    - server/routes: includes all API routes and routers
- client: contains all frontend files
    - client/src/routes: contains all .jsx files corresponding to pages in the UI



Credit:
- Frontend greatly influenced by LamaDev tutorial at [YouTube](https://www.youtube.com/watch?v=HFj5FMb0jwY&t=536s) / [GitHub](https://github.com/safak/react-estate-ui)
