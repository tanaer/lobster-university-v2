CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`timestamp` integer NOT NULL,
	`actor` text NOT NULL,
	`actor_type` text NOT NULL,
	`action` text NOT NULL,
	`level` text DEFAULT 'L1' NOT NULL,
	`target` text,
	`target_type` text,
	`department` text NOT NULL,
	`metadata` text,
	`status` text DEFAULT 'ok' NOT NULL,
	`error_message` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_events_timestamp` ON `events` (`timestamp`);--> statement-breakpoint
CREATE INDEX `idx_events_actor` ON `events` (`actor`);--> statement-breakpoint
CREATE INDEX `idx_events_action` ON `events` (`action`);--> statement-breakpoint
CREATE INDEX `idx_events_level` ON `events` (`level`);--> statement-breakpoint
CREATE TABLE `stats_daily` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`total_events` integer DEFAULT 0,
	`l1_events` integer DEFAULT 0,
	`l2_events` integer DEFAULT 0,
	`unique_actors` integer DEFAULT 0,
	`new_enrollments` integer DEFAULT 0,
	`courses_completed` integer DEFAULT 0,
	`certs_issued` integer DEFAULT 0,
	`errors` integer DEFAULT 0,
	`top_actions` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stats_daily_date_unique` ON `stats_daily` (`date`);