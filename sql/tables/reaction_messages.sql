CREATE TABLE `reaction_messages` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`uuid` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_bin',
	`title` VARCHAR(100) NOT NULL DEFAULT 'Reaction Roles' COLLATE 'utf8mb4_bin',
	`message_id` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_bin',
	`channel_id` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`guild_id` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_bin',
	`asking_channel` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`notes` VARCHAR(150) NOT NULL DEFAULT 'React below to get roles!' COLLATE 'utf8mb4_bin',
	`added_by` VARCHAR(100) NOT NULL DEFAULT 'system' COLLATE 'utf8mb4_bin',
	`modified_by` VARCHAR(100) NOT NULL DEFAULT 'system' COLLATE 'utf8mb4_bin',
	`added_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`updated_on` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deleted` VARCHAR(50) NOT NULL DEFAULT 'false' COLLATE 'utf8mb4_bin',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `UUID UNIQUE` (`uuid`) USING BTREE,
	UNIQUE INDEX `MESSAGEID UNIQUE` (`message_id`) USING BTREE
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
;
