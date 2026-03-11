CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`certification_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`track_id` text NOT NULL,
	`level` integer NOT NULL,
	`issued_at` integer NOT NULL,
	`expires_at` integer,
	`verify_url` text NOT NULL,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`track_id` text NOT NULL,
	`level` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`applied_at` integer NOT NULL,
	`approved_at` integer,
	`certificate_id` text,
	`notes` text,
	FOREIGN KEY (`profile_id`) REFERENCES `lobster_profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`track_id`) REFERENCES `career_tracks`(`id`) ON UPDATE no action ON DELETE no action
);
