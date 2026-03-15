ALTER TABLE `portfolios` ADD `skills` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `portfolios` ADD `review_status` text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `portfolios` ADD `review_feedback` text;--> statement-breakpoint
ALTER TABLE `users` ADD `parent_onboarding_completed` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `parent_report_subscription` text DEFAULT 'weekly';