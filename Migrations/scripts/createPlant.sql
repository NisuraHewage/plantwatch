CREATE TABLE Plants (Id INT AUTO_INCREMENT  PRIMARY KEY, Name Varchar(300), UserID INT, DeviceID INT, PlantProfileID INT 
Birthdate Date,CONSTRAINT fk_plant_user
    FOREIGN KEY (UserID) 
        REFERENCES Users(Id),
   CONSTRAINT fk_plant_device FOREIGN KEY (DeviceID) 
        REFERENCES Devices(Id),
        CONSTRAINT fk_plant_profile FOREIGN KEY (PlantProfileID) 
        REFERENCES PlantProfiles(Id));