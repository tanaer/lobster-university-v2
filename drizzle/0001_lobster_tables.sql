CREATE TABLE `career_tracks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`icon` text NOT NULL,
	`description` text NOT NULL,
	`risk_level` text NOT NULL,
	`market_demand` text,
	`study_duration` integer NOT NULL,
	`difficulty` integer NOT NULL,
	`capabilities` text NOT NULL,
	`portfolio_requirements` text NOT NULL,
	`job_directions` text NOT NULL,
	`order` integer DEFAULT 0,
	`published` integer DEFAULT true,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `career_tracks_code_unique` ON `career_tracks` (`code`);
--> statement-breakpoint
CREATE TABLE `lobster_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text,
	`student_id` text NOT NULL,
	`enrolled_at` integer,
	`career_track_id` text,
	`daily_study_minutes` integer DEFAULT 30,
	`study_reminder` text,
	`timezone` text DEFAULT 'Asia/Shanghai',
	`total_study_time` integer DEFAULT 0,
	`completed_tasks` integer DEFAULT 0,
	`portfolio_items` integer DEFAULT 0,
	`status` text DEFAULT 'active',
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`career_track_id`) REFERENCES `career_tracks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lobster_profiles_student_id_unique` ON `lobster_profiles` (`student_id`);
--> statement-breakpoint
CREATE TABLE `study_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`capability_id` text,
	`task_name` text NOT NULL,
	`task_type` text NOT NULL,
	`duration` integer NOT NULL,
	`deliverable` text,
	`deliverable_url` text,
	`status` text DEFAULT 'completed',
	`studied_at` integer,
	FOREIGN KEY (`profile_id`) REFERENCES `lobster_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `portfolios` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`capability_id` text,
	`content` text,
	`file_url` text,
	`status` text DEFAULT 'draft',
	`reviewed_at` integer,
	`reviewer_notes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`profile_id`) REFERENCES `lobster_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
