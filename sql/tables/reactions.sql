CREATE TABLE `reactions` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`uuid` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_bin',
	`guild_id` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_bin',
	`reaction_message` VARCHAR(100) NOT NULL DEFAULT '' COLLATE 'utf8mb4_bin',
	`emoji` VARCHAR(100) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_bin',
	`emoji_id` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_bin',
	`role` VARCHAR(100) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_bin',
	`added_by` VARCHAR(100) NOT NULL DEFAULT 'system' COLLATE 'utf8mb4_bin',
	`added_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`updated_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`modified_by` VARCHAR(100) NOT NULL DEFAULT 'system' COLLATE 'utf8mb4_bin',
	`deleted` VARCHAR(50) NOT NULL DEFAULT 'false' COLLATE 'utf8mb4_bin',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `uuid` (`uuid`) USING BTREE,
	INDEX `FK_reactions_reaction_messages` (`reaction_message`) USING BTREE,
	CONSTRAINT `FK_reactions_reaction_messages` FOREIGN KEY (`reaction_message`) REFERENCES `merlwyb`.`reaction_messages` (`message_id`) ON UPDATE NO ACTION ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
