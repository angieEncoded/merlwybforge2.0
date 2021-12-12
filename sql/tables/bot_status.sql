CREATE TABLE `bot_status` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`uuid` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`type` TEXT NOT NULL COLLATE 'utf8mb4_bin',
	`activity` TEXT NOT NULL COLLATE 'utf8mb4_bin',
	`added_by` TEXT NOT NULL COLLATE 'utf8mb4_bin',
	`added_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`updated_on` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deleted` VARCHAR(50) NOT NULL DEFAULT 'false' COLLATE 'utf8mb4_bin',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `uuid` (`uuid`) USING BTREE
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
;