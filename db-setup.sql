CREATE DATABASE IF NOT EXISTS WeatherData;
USE WeatherData;

CREATE TABLE IF NOT EXISTS Weather (
    Location VARCHAR(255) PRIMARY KEY,
    Temp DECIMAL(5, 2),
    TempMin DECIMAL(5, 2),
    TempMax DECIMAL(5, 2),
    Pressure INT,
    Humidity INT,
    LastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Locations (
    Name VARCHAR(255) NOT NULL,
    Query VARCHAR(255) NOT NULL,
    PRIMARY KEY (Name)
);

INSERT INTO Locations (Name, Query) VALUES
('München', 'Munich, DE'),
('Winnipeg', 'Winnipeg, CA'),
('Honolulu', 'Honolulu, US'),
('Sydney', 'Sydney, AU'),
('Peking', 'Beijing, CN'),
('La Paz', 'La Paz, BO'),
('Helsinki', 'Helsinki, FI'),
('Moskau', 'Moscow, RU'),
('Kapstadt', 'Cape Town, ZA'),
('Havanna', 'Havana, CU');
