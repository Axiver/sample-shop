-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: bed_ca1
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Laptops','Light and high performance laptops for school'),(3,'Mobile Phones','The best mobile phones on the market'),(4,'Keyboards','The best keyboards on the planet'),(7,'Mouse','All sorts of computer mice'),(8,'Desktop','Prebuilt Desktop computers'),(16,'Audio','Audio equipment to blow your ears off'),(19,'Vacuum Cleaner','Sucks Dust and Cleans your House!');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (36,7,'./uploads/product_images/f000f800ffc0ffd807c047c0ffc0ffc007c047c0ffc0ffc007c027c0ffc0ffc0.png',1),(39,1,'./uploads/product_images/03ff01ffe007e007f08fe10fe00fe00ff00ff00ff00fe00fe007e007ff57fc00.png',1),(40,11,'./uploads/product_images/0b800fc00ff87ff83ff03bf819b01b101a381c780ff80ff83ffc1ffc1fe00000.jpg',1),(41,11,'./uploads/product_images/000000004000400000001ffe03fe0bfe3bfe337e137e0000ffff000000000000.jpg',2),(42,11,'./uploads/product_images/3c003c003c003c0000000e4c1ffe3ffe3ffe00fe00ee006e7ffe7ffe000e0000.jpg',3),(43,11,'./uploads/product_images/000000000000078007800fc03fe07ff83ff80ffc07f802080308000000000000.jpg',4),(44,11,'./uploads/product_images/f800f800fc00ffbffe00fe00fe80fea07f803f00198307ff003f00ff01ff00ff.jpg',5),(45,11,'./uploads/product_images/407f803fc03fc03f801fe01fe01ff01ff81f601f003f00ff033f1c7f605f800f.jpg',6),(81,16,'./uploads/product_images/fe7df81c320c130c17ec97ec963c900cba1dba0db20d920f9009b8081c3f1fff.png',1),(84,17,'./uploads/product_images/ffff89ff801fff7fff3fff7fff7ffe7ffe7ffe7ffe7ffe7ffe7ffe7ffc3ffc3f.png',1),(85,20,'./uploads/product_images/ff07fe03f801f001f819fc11f831e861e803dc03de07de0b80018027187f7fff.jpg',1),(94,23,'./uploads/product_images/fe07e103e183e187e1c7e1c3e047e407e407e027e037e03fe01fe00fe00ffc07.jpg',1),(95,23,'./uploads/product_images/fdffc003e007e007f807ec07ec07e407fc07f007f017e017e003c007c007ffff.jpg',2);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'SP AMD Ryzen 3600 Laptop','Best Laptop',1,'SP IT!',1855.5,'2021-12-16 16:47:27'),(7,'SPhone 9000','Basically a quantum computer',3,'SP IT!',3845.99,'2021-12-24 18:06:29'),(11,'Razer Goliathus Chroma Extended','Oversized Soft Gaming Mouse Mat Powered by Razer Chroma<br><br><ul><li>Ultimate Personalization & Gaming Immersion with Razer Chroma: Fully syncs with popular games, Razer hardware, Philips Hue, and gear from 30 plus partners; supports 16.8 million colors</li><li>Designed for Control: A softer, micro-textured cloth surface gives more tactile feedback, allowing for higher precision in fast-paced games</li><li>Nonslip Rubber Base: Made of natural-foam rubber for keeping the Goliathus Chroma Extended mouse mat in place</li></ul>',1,'Razer',99.9,'2022-02-02 18:57:07'),(16,'Harman Kardon Soundstick 4','Brand new and sealed Harman Kardon Soundstick 4 for only $319!\n\nRegular retail price: $399\nYou save: $80\n\n Brand new and sealed\n Free shipping\n Covered under 1 full year of warranty under Harman Kardon Singapore\n\n Both Black and White are in stock!\n\n Harman Kardon SoundSticks 4 make a statement in any contemporary home. The groundbreaking transparent dome design and sleek silhouette blend in seamlessly with your decor. The two satellite speakers and subwoofer cover look stunning with an inner rippled surface design reflecting the beauty of music.\n Backed by decades of engineering expertise, discover the perfect combination of iconic design and exceptional audio. Enjoy consistently rich bass from the impressive dome subwoofer. And the two satellite speakers each have four drivers, for room-filling, clear, vibrant sound.\n Stream music wirelessly via Bluetooth® to enjoy room-filling sound.\n Welcome a timeless icon into your home with Harman Kardon SoundSticks 4. Extraordinary sound meets sculptural design in this one-of-a-kind audio masterpiece from the legendary Harman Kardon brand. Bring harmony into your living space with unparalleled sound quality and beautiful transparent materials. Highly regarded as a true work of art by passionate audio enthusiasts around the globe, Harman Kardon SoundSticks 4 is a stunning system that fills your space with vibrant treble and incredible bass. Transform the look and sound of your life and experience music in a new, exceptional way. \n\nIf you have any questions, feel free to PM me!\n\nIf you like this listing, do check out my profile. I sell other things that you will be interested in.',16,'Harman Kardon',330,'2022-02-07 04:33:28'),(17,'Airbot Hypersonics PRO 27000Pa 27kPa Smart Dust Sensing Auto Speed Cordless Lightweight Vacuum Cleaner','Brand new and sealed Airbot Hypersonics PRO for only $165!\n\nRegular retail price: $259.90\nYou save: $94.90',19,'Airbot',165,'2022-02-07 04:37:55'),(20,'Logitech G502 HERO','Hero 16K sensor through a software update from G HUB, this upgrade is free to all players: Our most advanced, with 1:1 tracking, 400+ ips, and 100 - 25,600 max dpi sensitivity plus zero smoothing, filtering, or acceleration\n11 customizable buttons and onboard memory: Assign custom commands to the buttons and save up to five ready to play profiles directly to the mouse\nAdjustable weight system: Arrange up to five removable 3.6 grams weights inside the mouse for personalized weight and balance tuning',7,'Logitech',61.4,'2022-02-07 04:43:47'),(23,'iPhone 13','Apple\'s latest iPhone.\n<br><br>\nFlash your bling bling with this slab of metal.',3,'Apple',1149,'2022-02-07 04:47:48');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (3,7,120,'2022-01-01 00:00:00','2022-01-01 23:59:59','2021-12-24 21:57:12'),(4,7,80,'2022-02-01 00:00:00','2022-02-01 23:59:59','2021-12-25 00:34:46'),(6,1,100,'2022-02-02 00:00:00','2022-02-10 23:59:59','2022-01-02 20:54:26'),(10,1,150,'2022-02-11 04:26:08','2022-02-12 04:26:11','2022-02-07 04:26:55');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (4,1,9,5,'Excellent product, I can see the quantum action','2021-12-24 22:16:09'),(18,1,1,1,'THIS PRODUCT IS TERRIBLE!!!!!!!!!!!','2022-02-05 22:44:26'),(20,1,31,5,'Wonderful product, love it.','2022-02-06 12:26:21'),(21,16,31,5,'This speaker was eargasm','2022-02-07 04:35:26');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_interests`
--

LOCK TABLES `user_interests` WRITE;
/*!40000 ALTER TABLE `user_interests` DISABLE KEYS */;
INSERT INTO `user_interests` VALUES (1,1,1),(3,2,1),(5,2,3),(6,1,3),(7,1,4),(10,13,1);
/*!40000 ALTER TABLE `user_interests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'someUsername','some@email.com','91234567','$2b$10$JuJPBnJbiP9QfrF76w4Fq.u0iT2QIeK4qrizeguQI8VCRp4mZ.KcG','Customer','/profile_images/default_profile_pic.png','2021-12-15 19:57:54'),(2,'zuckerberg','zucc@facebook.com','96969696','$2b$10$J.iIMDYrBfUQh1ZtXYWXdOqpsPmZHn5fYTz6wwbhC8a/HhtoniQdS','Customer','/profile_images/default_profile_pic.png','2021-12-15 20:00:16'),(9,'Andy Lee','andy@gmail.com','92564712','$2b$10$MXwfKxX6MlekDhpagLeaKuR/vNdyDQqYQk/PbQKzO6PQugMEhf9ym','Customer','/profile_images/default_profile_pic.png','2021-12-15 22:35:37'),(12,'Terry Tan','terrytan@gmail.com','91234567','$2b$10$7YAPRr62MKKCfvsG9bqmkOUMGYsUuvdHkH4stZUKpVpkzoTurnNZu','Customer','/profile_images/default_profile_pic.png','2022-01-02 18:33:26'),(13,'Peter Parker','pete@gmail.com','91234567','$2b$10$MawqoVsVFsDb9Aqrnc1FpexBv/x4CfTl5SNtzwdxDZhhEDqza7Qta','Customer','/profile_images/default_profile_pic.png','2022-01-10 16:19:49'),(14,'John Appleseed','john@bla.com','91234567','$2b$10$CvoXPYWyPAztr99.piw8jeRlc/iRbGTMfFN.O4jkJfFZLGnbaag/.','Customer','/profile_images/default_profile_pic.png','2022-01-10 16:24:58'),(31,'Xavier','xavier@example.com','91234567','$2b$10$AzM97Y2KWjHHcuNjyXG7Ce0m0MxZalenhQMo7mfK52S5RO66kq1OK','Admin','/profile_images/fc1df809f00ff00cf01ff007f007f807f81ff807d806fc01ff07fc07f007e400.jpg','2022-02-06 04:44:44');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-07  5:20:28
