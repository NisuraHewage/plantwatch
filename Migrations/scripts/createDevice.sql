CREATE TABLE Devices (Id INT AUTO_INCREMENT  PRIMARY KEY, DeviceID Varchar(300), UserID INT, DeviceName Varchar(100), CONSTRAINT fk_user
    FOREIGN KEY (UserID) 
        REFERENCES Users(Id));