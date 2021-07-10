CREATE TABLE Parameters (Id INT AUTO_INCREMENT  PRIMARY KEY, Title Varchar(300), Description Varchar(1000), PdfFileUrl Varchar(100), BodyContent Varchar(MAX), PlantProfileID INT,
Message Varchar(1000), Action Varchar(1000) ,CONSTRAINT fk_knowledge_profiles
    FOREIGN KEY (PlantProfileID) 
        REFERENCES PlantProfiles(Id));