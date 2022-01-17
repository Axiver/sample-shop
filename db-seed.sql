CREATE DATABASE  IF NOT EXISTS `bed_ca1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bed_ca1`;
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
INSERT INTO `categories` VALUES (1,'Laptops','Light and high performance laptops for school'),(3,'Mobile Phones','The best mobile phones on the market'),(4,'Keyboards','The best keyboards on the planet');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (14,7,'./uploads/ffffffffffffc01fc1df83c781c383c9cbebfbf5c001f003f1e3ffffffffffff.png',1),(15,7,'./uploads/ffff80019ff9cff3c7e3e3c7f3cff18ff81ffc3ffc3ffc3ffc3ffc3ffc3ffcff.png',2),(30,1,'./uploads/ffffffffffffc01fc1df83c781c383c9cbebfbf5c001f003f1e3ffffffffffff.png',1);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'SP AMD Ryzen 3600 Laptop','Best Laptop',1,'SP IT!',1855.5,'2021-12-16 16:47:27'),(7,'SPhone 9000','Basically a quantum computer',3,'SP IT!',3845.99,'2021-12-24 18:06:29');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (3,7,120,'2022-01-01 00:00:00','2022-01-01 23:59:59','2021-12-24 21:57:12'),(4,7,80,'2022-02-01 00:00:00','2022-02-01 23:59:59','2021-12-25 00:34:46'),(6,1,100,'2022-01-02 00:00:00','2022-01-02 23:59:59','2022-01-02 20:54:26');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (4,1,9,5,'Excellent product, I can see the quantum action','2021-12-24 22:16:09'),(6,1,1,5,'Great laptop! I can play all my games at 1000 fps in class!','2022-01-02 18:59:01');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_interests`
--

LOCK TABLES `user_interests` WRITE;
/*!40000 ALTER TABLE `user_interests` DISABLE KEYS */;
INSERT INTO `user_interests` VALUES (1,1,1),(3,2,1),(5,2,3),(6,1,3),(7,1,4);
/*!40000 ALTER TABLE `user_interests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'someUsername','some@email.com','91234567','$2b$10$JuJPBnJbiP9QfrF76w4Fq.u0iT2QIeK4qrizeguQI8VCRp4mZ.KcG','Customer','https://google.com','2021-12-15 19:57:54'),(2,'zuckerberg','zucc@facebook.com','96969696','lizard','Customer','lizard.png','2021-12-15 20:00:16'),(9,'Andy Lee','andy@gmail.com','92564712','$2b$10$MXwfKxX6MlekDhpagLeaKuR/vNdyDQqYQk/PbQKzO6PQugMEhf9ym','Customer','https://www.abc.com/andy.jpg','2021-12-15 22:35:37'),(12,'Terry Tan','terrytan@gmail.com','91234567','$2b$10$7YAPRr62MKKCfvsG9bqmkOUMGYsUuvdHkH4stZUKpVpkzoTurnNZu','Customer','https://www.abc.com/terry.jpg','2022-01-02 18:33:26');
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

-- Dump completed on 2022-01-02 22:03:29
