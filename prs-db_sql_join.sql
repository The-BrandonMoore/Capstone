--PRS Product - Vendor JOIN

SELECT * 
FROM Product;


--Result Set: PartNumber, Part Name, Price, VendorName
SELECT PartNumber, p.Name AS PartName, Price
FROM Product p
JOIN Vendor v ON v.Id = p.VendorId
ORDER BY PartName;