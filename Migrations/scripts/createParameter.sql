CREATE TABLE Parameters (Id INT AUTO_INCREMENT  PRIMARY KEY, Name Varchar(300), Value INT, UpperLimit INT, LowerLimit INT, PlantProfileID INT ,CONSTRAINT fk_plant_profiles
    FOREIGN KEY (PlantProfileID) 
        REFERENCES PlantProfiles(Id));