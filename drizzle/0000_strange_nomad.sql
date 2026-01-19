CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`ingredients` text NOT NULL,
	`instructions` text NOT NULL,
	`prep_time` text,
	`cook_time` text,
	`servings` integer,
	`category` text,
	`image_url` text,
	`source` text,
	`created_at` integer,
	`updated_at` integer
);
