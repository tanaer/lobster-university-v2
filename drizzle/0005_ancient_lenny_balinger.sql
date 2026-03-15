CREATE TABLE `career_directions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`description` text NOT NULL,
	`icon` text,
	`cover_image` text,
	`bundle_count` integer DEFAULT 0,
	`course_count` integer DEFAULT 0,
	`order` integer DEFAULT 0,
	`published` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `career_directions_code_unique` ON `career_directions` (`code`);--> statement-breakpoint
CREATE TABLE `course_bundles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`description` text NOT NULL,
	`career_direction_id` text,
	`use_case` text,
	`quick_start` text,
	`steps` text,
	`troubleshooting` text,
	`success_criteria` text,
	`security_audit` text,
	`source_url` text,
	`source_type` text,
	`course_count` integer DEFAULT 0,
	`order` integer DEFAULT 0,
	`published` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`career_direction_id`) REFERENCES `career_directions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `course_bundles_code_unique` ON `course_bundles` (`code`);--> statement-breakpoint
ALTER TABLE `skill_courses` ADD `bundle_id` text REFERENCES course_bundles(id);--> statement-breakpoint
ALTER TABLE `skill_courses` ADD `security_audit` text;--> statement-breakpoint
ALTER TABLE `skill_courses` ADD `security_score` integer;--> statement-breakpoint
ALTER TABLE `skill_courses` ADD `quality_score` text;--> statement-breakpoint
ALTER TABLE `skill_courses` ADD `source_url` text;--> statement-breakpoint
ALTER TABLE `skill_courses` ADD `hot_score` integer DEFAULT 0;