CREATE TABLE `sales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product` text NOT NULL,
	`category` text NOT NULL,
	`amount` integer NOT NULL,
	`quantity` integer NOT NULL,
	`date` text NOT NULL
);
