- The name of the project
    -- bookbook

- Names of the team members
    -- Annaleigh, Austin, Clem, Culi, Daniella

- A description of the project
    -- Create a more equitable way for bookclubs to choose and vote on books to read.

- The overall problem domain and how the project solves those problems
    -- Create a more equitable way for bookclubs to choose and vote on books to read. By using Ranked Choice Voting bookbook helps ensure that a reading group will not read the same books reccomended by the same person over and over again.

- Semantic versioning, beginning with version 1.0.0 and incremented as changes are made
    -- 0.0.1 (5/24/2021)
    -- 1.0.0 (5/28/2021)

- A list of any libraries, frameworks, or packages that your application requires in order to properly function
    -- React, Express

- Instructions that the user may need to follow in order to get your application up and running on their own 
    -- Create a ballot as an admin of your group, use the unique url as a member of your group to vote.
    
- Data Model (Back End)
    - /__tests__
        - /app.test.js
    - /data 
        - /create-tables.js
        - /drop-tables.js
        - /load-seed-data.js
        - /users.js
    - /lib
        - /auth
            - /create-auth-routes.js
            - /ensure-auth.js
            - /jwt.js
        - /middleware
            - /error.js
            - /not-found.js
        - /app.js
        - /client.js

- Data Model (Front End)
    - /src
        - /app
            - /App.css
            - /App.js
            - /Footer.css
            - /Footer.js
            - /Header.css
            - /Header.js
        - /ballot
            - /AdminPanel.js
            - /BallotPage.css
            - /BallotPage.js
            - /LoginPanel.js
            - /VotingPanel.js
        -/home
            - /Home.css
            - /Home.js
        -setup
            - /BookSuggest.css
            - /BookSuggest.js
            - /BooksPage.css
            - /BooksPage.js
        -/utils
            - /backend-api.js
            - /gbooks-api.js
            - /utils.js
            - /voting-methods.js

- FE Routes
    - .POST'/api/ballots'
        - Post a ballot
    - .PUT'/api/ballot:id'
        - Update a ballot by id
    - .GET'/api/:ballotid/suggestions'
        - Get suggestions from a ballot by ballotId
    - .POST'/api/suggestions'
        - Post a suggestion
    - .DELETE'/api/suggestions/:id'
        - Delete a suggestion by Id
    - .GET'/api/ballots/:id
        - Get a specific ballot by Id
    - .GET'/api/:ballotid/votes'
        - Get the votes of a specific ballot by ballotId
    - .POST'/api/votes'
        - Post a vote
    - .POST'/api/users'
        - Post a user
    - .GET'/api/:ballotid/users'
        - Get specific users from a ballot by ballotId
    - .PUT'/api/votes/:id'
        - Update a vote by Id

- Data Schema

Ballots
|id|admincode|name|vote_code|end_date|
|--|---------|----|---------|--------|
|  |         |    |         |        |
|  |         |    |         |        |
|  |         |    |         |        |
|  |         |    |         |        |

Suggestions
|id|user_id|ballot_id|gbooks|
|--|-------|---------|------|
|  |       |         |      |        
|  |       |         |      |        
|  |       |         |      |        
|  |       |         |      |        

Users
|id|username|ballot_id|password|
|--|--------|---------|--------|
|  |        |         |        |
|  |        |         |        |
|  |        |         |        |
|  |        |         |        |
        
Vote
|id|user_id|ballot_id|vote|
|--|-------|---------|------|
|  |       |         |      |        
|  |       |         |      |        
|  |       |         |      |        
|  |       |         |      |        

