USE prsdb;
GO

--Insert data into User table

INSERT INTO dbo.[User] (Username, Password, FirstName, LastName, PhoneNumber, Email, Reviewer, Admin)
VALUES
	('BMoore', 'TestPass',	'Brandon',	'Moore', '740-555-8191', 'email@email.com',				1, 1),
	('MMoore', 'Pass123',	'Megan',	'Moore', '740-882-9002', 'wife''semail@heremail.com',	1, 0),
	('HotDog', 'ILoveDogs', 'Audra',	'Moore', '740-900-2302', 'favorites@hotdogs.com',		0, 0);


--Insert Data into Vendor Table
INSERT INTO dbo.Vendor (Code, Name, Address, City, State, Zip, PhoneNumber, Email)
VALUES
	('HB001', 'Heavenly Books',					'123 Faith St',			'Nashville',		'TN', '37201', '615-555-1234', 'info@heavenlybooks.com'),
	('GMS02', 'Grace Music Store',				'456 Worship Ave',		'Charlotte',		'NC', '28202', '704-555-5678', 'sales@gracemusicstore.com'),
	('RL003', 'Holy Land Crafts',				'789 Scripture Blvd',	'Dallas',			'TX', '75201', '214-555-8765', 'contact@holylandcrafts.org'),
	('RL004', 'Divine Apparel',					'101 Spirit St',		'Orlando',			'FL', '32801', '407-555-2345', 'support@divineapparel.com'),
	('RL005', 'Faith Jewelry Co.',				'202 Blessings Rd',		'Phoenix',			'AZ', '85001', '602-555-9988', 'service@faithjewelry.com'),
	('RL006', 'Cross & Crown Gifts',			'303 Hope Blvd',		'Indianapolis',		'IN', '46201', '317-555-4455', 'contact@crossandcrowngifts.org'),
	('RL007', 'Shalom Judaica',					'404 Heritage Ave',		'New York',			'NY', '10001', '212-555-6767', 'sales@shalomjudaica.com'),
	('RL008', 'Inspire Christian Publishing',	'505 Faith Way',		'Denver',			'CO', '80201', '303-555-1212', 'info@inspirepublishing.org'),
	('RL009', 'Glory Bound Travel Agency',		'606 Pilgrim Ln',		'Las Vegas',		'NV', '89101', '702-555-9090', 'booking@gloryboundtravel.com'),
	('RL010', 'Praise Media Solutions',			'707 Worship Dr',		'Seattle',			'WA', '98101', '206-555-7878', 'info@praisemediasolutions.com')
;


--Insert Data Into Product Table
INSERT INTO dbo.Product (VendorId, PartNumber, Name, Price, Unit, PhotoPath)
VALUES
	(1, 'HB221',	'Christian Living Book - Volume 1',			19.99,		NULL,		NULL),
	(1, 'HB432',	'Devotional Journal',						9.99,		NULL,		NULL),
	(2, 'GM091',	'Worship Guitar - Acoustic',				249.99,		NULL,		NULL),
	(2, 'GM472',	'Piano for Praise Music',					999.99,		NULL,		NULL),
	(3, 'HC761',	'Handmade Olive Wood Cross',				29.99,		NULL,		NULL),
	(3, 'HC232',	'Holy Land Anointing Oil',					14.99,		NULL,		NULL),
	(4, 'DA0031',	'Faith-Based T-Shirt',						19.99,		NULL,		NULL),
	(4, 'DA34002',	'Inspirational Hoodie',						34.99,		NULL,		NULL),
	(5, '9877701',	'Cross Necklace',							49.99,		NULL,		NULL),
	(5, '990dd02',	'Faith Bracelet',							24.99,		NULL,		NULL),
	(6, '4480041',	'Bible Verse Plaque',						14.99,		NULL,		NULL),
	(6, '3394452',	'Religious Gift Box Set',					39.99,		NULL,		NULL),
	(7, 'SJ4941',	'Menorah',									59.99,		NULL,		NULL),
	(7, 'SJ9332',	'Star of David Pendant',					79.99,		NULL,		NULL),
	(8, 'ICP001',	'Christian Inspirational Book',				12.99,		NULL,		NULL),
	(8, 'ICP002',	'Faith-Based Children\''s Storybook',		7.99,		NULL,		NULL),
	(9, 'GBT001',	'Holy Land Tour Package',					1599.00,	'Package',	NULL),
	(9, 'GBT002',	'Pilgrimage to Jerusalem',					2299.00,	'Package',	NULL),
	(10, '9330901',	'Christian DVD Set',						29.99,		NULL,		NULL),
	(10, '9440002',	'Religious Podcast Subscription',			5.99,		'Monthly',	NULL)
;



--Insert Data into Request Table

INSERT INTO dbo.Request (UserId, Description, Justification, DateNeeded, DeliveryMode, Status, Total, SubmittedDate, ReasonForRejection)
	SELECT R.UserId
	FROM [User] U
	JOIN Request R ON U.Id = R.UserId



--Insert Date into the Line Item Table
INSERT INTO dbo.LineItem (RequestId, ProductId, Quantity)
	SELECT R.RequestId, P.ProductId, 
	FROM