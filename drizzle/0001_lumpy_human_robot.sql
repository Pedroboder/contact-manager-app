CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nome` varchar(255) NOT NULL,
	`telefone` varchar(20),
	`email` varchar(320),
	`rua` varchar(255),
	`numero` varchar(10),
	`complemento` varchar(255),
	`bairro` varchar(100),
	`cidade` varchar(100),
	`estado` varchar(2),
	`cep` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
