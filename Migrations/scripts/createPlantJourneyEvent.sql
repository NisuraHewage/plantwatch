CREATE TABLE PlantEventJourney (Id INT AUTO_INCREMENT  PRIMARY KEY, Title Varchar(300), Description Varchar(1000), GifUrl Varchar(200),
CareInstructions Varchar(6000), WeeksAfterBirth INT, 
PlantProfileId INT,  CONSTRAINT fk_plantprofile_event
    FOREIGN KEY (PlantProfileId) 
        REFERENCES PlantProfiles(Id));