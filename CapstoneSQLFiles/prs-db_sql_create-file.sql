USE MASTER;
GO


DROP DATABASE IF EXISTS prsdb;
GO


CREATE DATABASE prsdb;
GO

USE prsdb;
GO


-- create "USER" table
CREATE TABLE [User] (
	Id				int						PRIMARY KEY IDENTITY(1,1),
	Username		varchar(20)				NOT NULL,
	Password		varchar(10)				NOT NULL,
	FirstName		varchar(20)				NOT NULL,
	LastName		varchar(20)				NOT NULL,
	PhoneNumber		varchar(12)				NOT NULL,
	Email			varchar(75)				NOT NULL,
	Reviewer		bit						DEFAULT 0 NOT NULL,
	Admin			bit						DEFAULT 0 NOT NULL,
	CONSTRAINT		UQ_User_Username		UNIQUE (Username),
	CONSTRAINT		UQ_User_Person			UNIQUE (FirstName, LastName, PhoneNumber),
	CONSTRAINT		UQ_User_Email			UNIQUE (Email)
);


--create "VENDOR" table
CREATE TABLE Vendor (
	Id				int						PRIMARY KEY IDENTITY(1,1),
	Code			varchar(10)				NOT NULL,
	Name			varchar(255)			NOT NULL,
	Address			varchar(255)			NOT NULL,
	City			varchar(255)			NOT NULL,
	State			char(2)					NOT NULL,
	Zip				char(5)					NOT NULL,
	PhoneNumber		varchar(12)				NOT NULL,
	Email			varchar(100)			NOT NULL,
	CONSTRAINT		UQ_Vendor_Code			UNIQUE (Code),
	CONSTRAINT		UQ_Vendor_Business		UNIQUE (Name, Address, City, State)
);


--create "PRODUCT" table
CREATE TABLE Product (
	Id				int						PRIMARY KEY IDENTITY(1,1),
	VendorId		int						NOT NULL,
	PartNumber		varchar(50)				NOT NULL,
	Name			varchar(150)			NOT NULL,
	Price			decimal(10,2)			NOT NULL,
	Unit			varchar(255)			NULL,
	PhotoPath		varchar(255)			NULL,
	CONSTRAINT		UQ_Product_PartNumber	UNIQUE (VendorId, PartNumber),
	FOREIGN KEY		(VendorId)				REFERENCES Vendor(Id)
);


--create "REQUEST" table
CREATE TABLE Request (
	Id					int				PRIMARY KEY IDENTITY(1,1),
	UserId				int				NOT NULL,
	RequestNumber		varchar(20)		NOT NULL,
	Description			varchar(100)	NOT NULL,
	Justification		varchar(255)	NOT NULL,
	DateNeeded			date			NULL,
	DeliveryMode		varchar(25)		NOT NULL,
	Status				varchar(20)		NOT NULL DEFAULT 'New',
	Total				decimal(10,2)	NOT NULL,
	SubmittedDate		datetime		DEFAULT current_timestamp NOT NULL,
	ReasonForRejection	varchar(100)	NULL,
	FOREIGN KEY			(UserId)				REFERENCES [User](Id),
	CONSTRAINT			UQ_Product_Req_Num		UNIQUE (RequestNumber)
);


--create "LINEITEM" table
CREATE TABLE LineItem (
	Id				int				PRIMARY KEY IDENTITY(1,1),
	RequestId		int				NOT NULL,
	ProductId		int				NOT NULL,
	Quantity		int				NOT NULL,
	FOREIGN KEY		(RequestId)		REFERENCES Request(Id),
	FOREIGN KEY		(ProductId)		REFERENCES Product(Id),
	CONSTRAINT      UQ_LineItem_Req_Prod UNIQUE (RequestId, ProductId)
);




