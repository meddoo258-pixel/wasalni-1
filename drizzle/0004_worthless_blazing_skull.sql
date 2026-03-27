CREATE TABLE `corporate_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320) NOT NULL,
	`employeeCount` int,
	`serviceType` enum('employees','students','mixed','airport') NOT NULL,
	`city` varchar(100),
	`requirements` text,
	`status` enum('pending','contacted','contracted','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `corporate_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rental_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320),
	`vehicleType` enum('sedan','h1','hiace','coaster') NOT NULL,
	`rentalPurpose` varchar(255),
	`startDate` varchar(20) NOT NULL,
	`endDate` varchar(20) NOT NULL,
	`pickupLocation` varchar(255),
	`notes` text,
	`status` enum('pending','confirmed','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rental_requests_id` PRIMARY KEY(`id`)
);
