BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `sessions` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`address`	TEXT,
	`processed`	INTEGER DEFAULT 0,
	`swept`	INTEGER DEFAULT 0,
	`userid`	INTEGER,
	`net`	INTEGER DEFAULT 1,
	`amount`	TEXT DEFAULT 0,
	`paymenttype`	INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS `order_product_meta` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`productid`	INTEGER,
	`metaname`	TEXT,
	`metavalue`	TEXT
);
CREATE TABLE IF NOT EXISTS `order_product` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`address`	TEXT,
	`name`	TEXT,
	`price`	TEXT,
	`quantity`	INTEGER
);
CREATE TABLE IF NOT EXISTS `order_payment_details` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`address`	TEXT,
	`providerid`	INTEGER,
	`paymentobject`	TEXT,
	`paymentresponseobject`	TEXT
);
CREATE TABLE IF NOT EXISTS `order_meta` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`productid`	INTEGER,
	`metaname`	TEXT,
	`metavalue`	TEXT
);
CREATE TABLE IF NOT EXISTS `lookup_payment_providers` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`providername`	INTEGER,
	`external`	INTEGER DEFAULT 0
);
INSERT INTO `lookup_payment_providers` VALUES (1,'Bitcoin Core node',0);
INSERT INTO `lookup_payment_providers` VALUES (2,'Strike',1);
CREATE TABLE IF NOT EXISTS `ecs_user_settings` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`userid`	INTEGER
);
INSERT INTO `ecs_user_settings` VALUES (1,3);
CREATE TABLE IF NOT EXISTS `ecs_user` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`username`	TEXT,
	`password`	TEXT,
	`isadmin`	INTEGER,
	`sessiontoken`	TEXT
);
INSERT INTO `ecs_user` VALUES (3,'admin','admin',1,'');
CREATE TABLE IF NOT EXISTS `ecs_emailtemplates` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`name`	TEXT,
	`subject`	TEXT,
	`body`	TEXT,
	`fromname`	TEXT,
	`fromemail`	TEXT,
	`active`	INTEGER DEFAULT 1
);
INSERT INTO `ecs_emailtemplates` VALUES (2,'admin','yay','way','system','system',1);
INSERT INTO `ecs_emailtemplates` VALUES (3,'ECS Sales','New Order ','Hello,<br /><br />

You have a new order.  The details of this order are below.<br /><br />

Customer Email: [ORDEREMAIL]<br /><br />

Order Details<br />
[ORDERDETAILS]<br /><br />

Order Total:  [ORDERTOTAL] BTC<br /><br />

Funds sent to : [COLDSTORAGE]<br /><br />

Thanks<br /><br />

ECS<br /><br />



','ecs','ecs@cryptoskillz.com',1);
CREATE TABLE IF NOT EXISTS `ecs_coldstorageaddresses` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`userid`	INTEGER,
	`address`	TEXT,
	`used`	INTEGER DEFAULT 0,
	`autosendfunds`	INTEGER DEFAULT 1
);
COMMIT;
