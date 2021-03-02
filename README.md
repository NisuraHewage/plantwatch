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

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    The following functions facilitate functionality

Create User

    /user/ - POST
    request{
        email: string,
        password: string
    }

    201
    returns{
        message: "Successfully created user",
        created: {{ userId }}
    }

Login

    /user/login - POST
    request{
        email: string,
        password: string
    }

    200
    returns{
        token: {{ authToken }}
    }

Verify Token (Managed Auth) - Different for mobile (User account), sys admin (User account), IOT (Device Id)

    /user/token - POST
    request{
        token: string
    }

    200
    returns{
        securityPolicy: {{ generatedByAWS }} // Allows access to endpoints
    }

Post Readings

    /vitals/{{ deviceId }} - POST
    request{
        timeStamp: DateTime,
        light: double,
        moisture: double,
        humidity: double,
        temperature: double
    }

    201
    returns{
        
    }

Get Readings

    /vitals/{{ plantId }}?start={{ startRange }}&end={{ endRange }} - GET
    request{

    }

    200
    returns{
        lastUpdated: DateTime,
        light: double,
        moisture: double,
        humidity: double,
        temperature: double
    }

Add Device 
    - Returns Device Id which is sent to the device

    /user/{{ userId }}/device/ - POST
    request{
        deviceId: string
    }

    201
    returns{
        
    }

Get Devices

    /user/{{ userId }}/devices - Get
    request{
    }

    200
    returns{
        result: Device[]
    }

Add Plant Profile

    /profile/ - POST
    request{
        name: string,
        scientificName: string
    }

    201
    returns{
        created: {{ created Id }}
    }

Get Plant Profiles

    /profile?name={{ profileName }} - Get
    request{
    }

    200
    returns{
        created: PlantProfile[]
    }

Add Plant

    /user/{{ userId }}/device/{{ deviceId }}/plant - POST
    request{
        name: string,
        profileId: string
    }

    201
    returns{
        created: {{ created Id }}
    }

Get Plants

    /user/{{ userId }}/plants - Get
    request{
    }

    200
    returns{
        result: Plant[]
    }

Add Knowledge Base

    /profile/{{ profileId }}/knowledge - POST
    request
    Content-Type: multipart/form-data; 
    {
        title: string,
        description: string
    }

    201
    returns{
        created: {{ created Id }}
    }

View Knowledge Base

    /profile/{{ plantId }}/knowledge - GET
    request{

    }

    200
    returns{
        results: KnowledgeBase[]
    }

Upsert Parameters - Adds the parameters that don't exist and updates the ones that do

    /profile/{{ profileId }} - PUT
    request{
        parameters: Parameter[]
    }

    204
    returns{
        created: {{ created Id }}
    }

Post Disease Image

    /plant/{{ plantId }}/disease - POST
    request
    Content-Type: multipart/form-data; 
    {
        timestamp: DateTime
    }

    201 
    returns{
        result: DiseaseIdentificationResult
    }

View Disease Results

    /plant/{{ plantId }}/disease?start={{ startRange }}&end={{ endRange }} - GET
    request{

    }

    200
    returns{
        results: DiseaseIdentificationResult[]
    }

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


mysql models will be executed as scripts on the mysql server and will be reverse reflected on the services directory

    Models

User
    npx sequelize-cli model:generate --name User --attributes email:string,password:string

Device 
    npx sequelize-cli model:generate --name Device --attributes deviceID:string

PlantProfile
    npx sequelize-cli model:generate --name PlantProfile --attributes name:string,scientificName:string

Plant
    npx sequelize-cli model:generate --name Plant --attributes name:string,profileId:INTEGER

Parameter
    npx sequelize-cli model:generate --name Parameter --attributes name:string,value:DOUBLE

DiseaseIdentificationResult (Nosql)

Reading (Nosql) - Dynamo?

Notification (Nosql) - Dynamo?

sequelize-auto -h <host> -d <database> -u <user> -x [password] -p [port]  --dialect [dialect]  -o [/path/to/models] 