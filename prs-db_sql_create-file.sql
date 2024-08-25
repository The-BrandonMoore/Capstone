USE MASTER;
GO

DROP DATABASE IF EXISTS prs_db;
GO

CREATE DATABASE prs_db;

USE prs_db;
GO

CREATE TABLE Users (
	Id				int						PRIMARY KEY IDENTITY(1,1),
	Username		varchar(255)			NOT NULL,
	Password		varchar(255)			NOT NULL,
	FirstName		varchar(50)				NOT NULL,
	LastName		varchar(50)				NOT NULL,
	PhoneNumber		varchar(20)				NOT NULL,
	Email			varchar(100)			NOT NULL,
	Reviewer		tinyint					NOT NULL,
	Admin			tinyint					NOT NULL,
	CONSTRAINT		UQ_Users_Username		UNIQUE (Username),
	CONSTRAINT		UQ_Users_PhoneNumber	UNIQUE (PhoneNumber),
	CONSTRAINT		UQ_Users_Email			UNIQUE (Email)
);

CREATE TABLE Vendor (
	Id				int						PRIMARY KEY IDENTITY(1,1),
	Code			varchar(255)			NOT NULL,
	Name			varchar(255)			NOT NULL,
	Address			varchar(255)			NOT NULL,
	City			varchar(50)				NOT NULL,
	State			varchar(25)				NOT NULL,
	Zip				varchar(9)				NOT NULL,
	PhoneNumber		varchar(20)				NOT NULL,
	Email			varchar(100)			NOT NULL,
	CONSTRAINT		UQ_Vendor_Code			UNIQUE (Code),
	CONSTRAINT		UQ_Vendor_Name			UNIQUE (Name),
	CONSTRAINT		UQ_Vendor_PhoneNumber	UNIQUE (PhoneNumber),
	CONSTRAINT		UQ_Vendor_Email			UNIQUE (Email)
);

CREATE TABLE Request (
	Id					int				PRIMARY KEY IDENTITY(1,1),
	UserId				int				NOT NULL,
	Description			varchar(255)	NOT NULL,
	Justification		varchar(255)	NOT NULL,
	DateNeeded			varchar(50)		NOT NULL,
	DeliveryMode		varchar(25)		NOT NULL,
	Status				varchar(9)		NOT NULL,
	Total				int				NOT NULL,
	SubmittedDate		date			NOT NULL,
	ReasonForRejection	varchar(255)	NOT NULL,
	FOREIGN KEY			(UserId)		REFERENCES Users(Id)
);

CREATE TABLE Product (
	Id					int						PRIMARY KEY IDENTITY(1,1),
	VendorId			int						NOT NULL,
	PartNumber			varchar(255)			NOT NULL,
	Name				varchar(255)			NOT NULL,
	Price				int						NOT NULL,
	Unit				varchar(25)				NOT NULL,
	Status				varchar(9)				NOT NULL,
	CONSTRAINT			UQ_Product_PartNumber	UNIQUE (PartNumber),
	FOREIGN KEY			(VendorId)				REFERENCES Vendor(Id)
);

CREATE TABLE LineItem (
	Id				int				PRIMARY KEY IDENTITY(1,1),
	RequestId		int				NOT NULL,
	ProductId		int				NOT NULL,
	Quantity		int				NOT NULL,
	FOREIGN KEY		(RequestId)		REFERENCES Request(Id),
	FOREIGN KEY		(ProductId)		REFERENCES Product(Id)
);




