CREATE TABLE `forum_replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`threadId` int NOT NULL,
	`content` text NOT NULL,
	`authorId` int,
	`authorName` varchar(255),
	`parentReplyId` int,
	`upvotes` int NOT NULL DEFAULT 0,
	`downvotes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forum_replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_threads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`category` enum('general','jobs','events','help','showcase','feedback') NOT NULL DEFAULT 'general',
	`authorId` int,
	`authorName` varchar(255),
	`isPinned` boolean NOT NULL DEFAULT false,
	`isLocked` boolean NOT NULL DEFAULT false,
	`viewCount` int NOT NULL DEFAULT 0,
	`replyCount` int NOT NULL DEFAULT 0,
	`upvotes` int NOT NULL DEFAULT 0,
	`downvotes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastActivityAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forum_threads_id` PRIMARY KEY(`id`),
	CONSTRAINT `forum_threads_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `forum_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`targetType` enum('thread','reply') NOT NULL,
	`targetId` int NOT NULL,
	`voteType` enum('up','down') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forum_votes_id` PRIMARY KEY(`id`)
);
