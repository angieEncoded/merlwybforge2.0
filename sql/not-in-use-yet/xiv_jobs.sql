CREATE TABLE `xiv_jobs` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`job_name` TEXT NOT NULL COLLATE 'latin1_swedish_ci',
	`job_abbrv` TEXT NOT NULL COLLATE 'latin1_swedish_ci',
	`role` TEXT NOT NULL COLLATE 'latin1_swedish_ci',
	`emoji` TEXT NOT NULL COLLATE 'latin1_swedish_ci',
	`added_by` TEXT NOT NULL COLLATE 'latin1_swedish_ci',
	`added_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=19
;
