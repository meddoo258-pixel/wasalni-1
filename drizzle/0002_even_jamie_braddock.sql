CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rideId` int NOT NULL,
	`riderId` int NOT NULL,
	`status` enum('confirmed','cancelled','completed') NOT NULL DEFAULT 'confirmed',
	`seatNumber` int,
	`pickupLocation` varchar(255),
	`pickupLat` decimal(10,8),
	`pickupLng` decimal(11,8),
	`price` decimal(8,2) NOT NULL,
	`paymentMethod` enum('wallet','tabby','tamara','card') DEFAULT 'wallet',
	`paymentStatus` enum('pending','completed','failed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `driver_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`licenseNumber` varchar(50) NOT NULL,
	`licenseExpiry` timestamp,
	`vehicleType` enum('sedan','h1','hiace','coaster') NOT NULL,
	`vehiclePlate` varchar(50) NOT NULL,
	`vehicleColor` varchar(30),
	`vehicleCapacity` int DEFAULT 4,
	`rating` decimal(3,2) DEFAULT '5.00',
	`totalRides` int DEFAULT 0,
	`totalEarnings` decimal(10,2) DEFAULT '0.00',
	`isVerified` boolean DEFAULT false,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `driver_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `driver_profiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `driver_profiles_licenseNumber_unique` UNIQUE(`licenseNumber`),
	CONSTRAINT `driver_profiles_vehiclePlate_unique` UNIQUE(`vehiclePlate`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int,
	`userId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paymentMethod` enum('wallet','tabby','tamara','card') NOT NULL,
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(100),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promotions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`discountType` enum('percentage','fixed') NOT NULL,
	`discountValue` decimal(8,2) NOT NULL,
	`maxUses` int,
	`currentUses` int DEFAULT 0,
	`expiryDate` timestamp,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promotions_id` PRIMARY KEY(`id`),
	CONSTRAINT `promotions_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rideId` int NOT NULL,
	`riderId` int NOT NULL,
	`driverId` int NOT NULL,
	`riderRating` int,
	`driverRating` int,
	`riderComment` text,
	`driverComment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rider_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rating` decimal(3,2) DEFAULT '5.00',
	`totalRides` int DEFAULT 0,
	`totalSpent` decimal(10,2) DEFAULT '0.00',
	`walletBalance` decimal(10,2) DEFAULT '0.00',
	`preferredLocations` json,
	`emergencyContact` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rider_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `rider_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `rides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`routeId` int NOT NULL,
	`driverId` int,
	`status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`scheduledTime` timestamp NOT NULL,
	`actualStartTime` timestamp,
	`actualEndTime` timestamp,
	`totalSeats` int DEFAULT 4,
	`availableSeats` int DEFAULT 4,
	`price` decimal(8,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`startLocation` varchar(255) NOT NULL,
	`endLocation` varchar(255) NOT NULL,
	`startLat` decimal(10,8),
	`startLng` decimal(11,8),
	`endLat` decimal(10,8),
	`endLng` decimal(11,8),
	`distance` decimal(8,2),
	`estimatedTime` int,
	`basePrice` decimal(8,2) NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `routes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`attachmentUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `support_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rideId` int,
	`subject` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`priority` enum('low','medium','high') DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` decimal(10,2) DEFAULT '0.00',
	`totalAdded` decimal(10,2) DEFAULT '0.00',
	`totalSpent` decimal(10,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `profileImage` text;--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('rider','driver','admin') DEFAULT 'rider' NOT NULL;