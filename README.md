# plantwatch
Repository to maintain Team OG's progress in their pilot project for an all in one smart IOT plant monitoring solution

Directory Structure -

    - Services contain the AWS Lamda functions correlating to the relevant endpoints
    - Mobile will contain all the source code for the flutter mobile application
    - Model contains the machine learning model that will be used for disease identification
    - Sysadmin has the angular application that is used to manage plant profiles and notifications
    - Migrations will handle all data related tasks particularly managing the rds and any ad hoc queries that may need to be executed


Create serverless function (in the services directory)

    serverless create function -f testFunction --handler src/functions/testFunction.testFunction --path src/tests/

Test