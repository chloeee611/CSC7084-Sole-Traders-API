-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2026 at 02:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `soletraders`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `client_email_address` varchar(255) NOT NULL,
  `service_id` int(11) NOT NULL,
  `requested_date_time` datetime NOT NULL,
  `job_description` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `client_name`, `client_email_address`, `service_id`, `requested_date_time`, `job_description`, `status`) VALUES
(16, 'Bill Conway', 'bill_c1965@gmail.com', 20, '2026-03-20 15:30:00', 'Washing machine causing fuse to trip', 'confirmed'),
(17, 'Jenny Black', 'j.b.0812@hotmail.co.uk', 21, '2026-03-30 10:00:00', 'Need some rewiring done in home office area', 'rejected'),
(18, 'Jackson English', 'jackson.e1989@gmail.com', 22, '2026-04-01 13:50:00', 'Need full PAT test done in rental property', 'confirmed'),
(19, 'Dan Hanna', 'danhan25@yahoo.co.uk', 28, '2026-03-18 11:45:00', 'Require full patio and deck cleaning', 'pending'),
(21, 'Connor Stewart', 'c.stewart1998@gmail.com', 38, '2026-03-30 13:00:00', 'Need back door lock repaired', 'pending'),
(22, 'Jane Smith', 'jane.c.s@yahoo.co.uk', 37, '2026-04-07 16:45:00', 'Need locks installed at a new property', 'pending'),
(23, 'Penny Gordon', 'p_gord24@gmail.com', 26, '2026-03-25 12:00:00', 'Deck has rotted, need new one fitted', 'pending'),
(24, 'Janet Porter', 'jan_porter1994@yahoo.com', 20, '2026-03-28 15:10:00', 'Fridge stopped working', 'pending'),
(25, 'Ryan Watt', 'ryan.w19@btinternet.com', 21, '2026-03-28 08:15:00', 'Need assistance rewiring property', 'pending'),
(26, 'Sandy Brown', 'san.p.brown@yahoo.co.uk', 22, '2026-03-28 12:30:00', 'Require full safety check on appliances', 'pending'),
(27, 'Rick Christian', 'rick_c1993@gmail.com', 20, '2026-04-01 15:45:00', 'Problem with oven', 'pending'),
(28, 'Martin Sheen', 'tin.sheen79@hotmail.co.uk', 23, '2026-03-28 18:00:00', 'Need new fusebox installed', 'confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `rating_id` int(11) NOT NULL,
  `trader_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`rating_id`, `trader_id`, `rating`) VALUES
(40, 4, 5),
(41, 4, 4),
(42, 4, 5),
(43, 12, 4),
(44, 13, 5),
(45, 14, 5),
(46, 14, 5),
(47, 14, 4),
(48, 15, 2),
(49, 15, 5),
(50, 15, 5),
(51, 15, 3),
(52, 15, 5),
(53, 15, 4),
(54, 15, 4),
(55, 15, 5),
(56, 16, 3),
(57, 16, 2),
(58, 16, 1),
(59, 16, 4),
(60, 4, 5),
(61, 4, 5),
(62, 4, 1),
(63, 17, 4),
(64, 18, 5);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `trader_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(600) NOT NULL,
  `pricing_type` enum('Hourly','Fixed') NOT NULL,
  `base_price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `trader_id`, `title`, `description`, `pricing_type`, `base_price`) VALUES
(20, 4, 'Electrical Faults and Repairs', 'Can deal with simple and complex electrical issues caused by appliances', 'Hourly', 79.4),
(21, 4, 'Rewiring', 'Rewiring part of or the entire property', 'Hourly', 94.6),
(22, 4, 'Safety Checks and Certificates', 'Perform safety checks on household appliances', 'Hourly', 35.4),
(23, 4, 'Fuseboxes', 'Fusebox installation or replacement', 'Fixed', 128),
(24, 12, 'Kitchen Units and Worktops', 'Install kitchen units and repair wooden worktops', 'Hourly', 75.66),
(25, 12, 'Furniture Making and Repair', 'Custom furniture making, assembly, and repair', 'Hourly', 64.6),
(26, 12, 'Decking', 'Build new deck or repair exisitng deck', 'Fixed', 670),
(27, 12, 'Doors and Windows', 'Install or repair doors and window frames', 'Fixed', 120),
(28, 13, 'Cleaning', 'Cleaning driveways, patios, and other outdoor areas', 'Hourly', 32.7),
(29, 13, 'Fixtures and Fittings', 'Fixtures for mirrors, shelves, TVs etc.', 'Fixed', 28.3),
(30, 13, 'Small Tasks', 'Can help with various small tasks, please contact me for further details', 'Hourly', 25.55),
(31, 14, 'Grass and Hedge Trimming', 'General maintenance on grass and hedges', 'Hourly', 37.8),
(32, 14, 'Weeding', 'Removal of stubborn weeds', 'Hourly', 32.4),
(33, 14, 'Landscaping', 'Changing garden layout', 'Fixed', 97),
(34, 14, 'Tree Surgery', 'Cutting down and trimming trees', 'Fixed', 53.48),
(35, 14, 'Fencing', 'Putting up or repairing fences in the garden', 'Hourly', 48.28),
(36, 14, 'Other Gardening Tasks', 'Minor tasks including watering garden, installing planters, or planting new flowers', 'Hourly', 23.1),
(37, 15, 'New Locks', 'Installation of new locks', 'Fixed', 45.5),
(38, 15, 'Repair Locks', 'Repairing or maintenance of locks', 'Fixed', 39),
(39, 15, 'Locked Out', 'Can pick and fit new locks if you have lost your keys', 'Fixed', 96.74),
(40, 16, 'Building New Wall', 'Building small or decorative walls', 'Hourly', 87.36),
(41, 16, 'Building New Structures', 'Building porches, garages, extensions etc.', 'Hourly', 94.4),
(42, 16, 'Wall Removal', 'Removing entire walls or part of a wall for window or door installation', 'Hourly', 87.28),
(43, 16, 'Repairs', 'Repairing loose bricks or rebuilding sections of damaged wall', 'Hourly', 102.36),
(47, 18, 'Radiators', 'Radiator repair or maintenance, e.g. leaking and bleeding', 'Hourly', 26.35),
(48, 17, 'Building Walls', 'Building new walls for extensions or other structures', 'Hourly', 106.34);

-- --------------------------------------------------------

--
-- Table structure for table `traders`
--

CREATE TABLE `traders` (
  `trader_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `trade_type_id` int(11) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `availability` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `traders`
--

INSERT INTO `traders` (`trader_id`, `name`, `username`, `email`, `password`, `trade_type_id`, `region`, `availability`, `bio`) VALUES
(4, 'Stefan Segal', 'sfse', 'sfse@gmail.com', '$2b$10$o4xwZK8tuN5uvq7YRVblxed8N8dsxpKdiMGA4Z.mWScGF41JL6pee', 2, 'Banbridge', 'Thurs-Sun', 'I am Electrician'),
(12, 'Jacob Smith', 'j.smith75', 'j.smith@gmail.com', '$2b$10$QtGyniv9yjDEIzffOkGXPuAvJpRI8um81dnjC8qbCDG1Nu2rasEEO', 3, 'Belfast', 'Mon-Fri', 'I have 10 years of experience as a carpenter'),
(13, 'John Hedge', 'hedge22', 'john_hedge22@hotmail.com', '$2b$10$gMdAHejWOn9zdCu5RNBm1eXqWk0QbUTFCzL4HzgQIa2HLKOiBQuh2', 11, 'Bangor', 'Mon-Thurs', 'I am a handyman based in the Bangor area and can help you with various household tasks'),
(14, 'Simon Moon', 'simoon89', 'si.moon@hotmail.com', '$2b$10$I8jjH8c8S278ioWrbXVwLuhvC6mi/hYq3ecTw/2NpX9cqpOwVDHoK', 8, 'Comber', 'Tues-Sat', 'I am based in Comber and can assist you with simple and complex gardening tasks'),
(15, 'Alex Sullivan', 'a_sullivan28', 'a_sulli@gmail.com', '$2b$10$82wzKSz087kIY.1eKgowiu4jqPwdX5XERiSouLsJxGdfNC/FBZkaK', 10, 'Belfast', 'Mon-Sun', 'I am available 7 days a week from 8AM to 6PM. For emergencies outside of my working hours, please contact 07865 526865'),
(16, 'Bob Duncan', 'bob.d1972', 'bobduncan72@gmail.com', '$2b$10$1TpqoyG33sUIVcm2xH1qA.bzIxUW2k9alxXJN.B9BrDl6FdyadH8K', 5, 'Newtownards', 'Wed-Sat', 'Professional bricklayer with 21 years of experience. Please contact me for further details if my listed services do not align with your needs.'),
(17, 'Chloe Chiu', 'chloe.chiu', 'chloe.chiu@gmail.com', '$2b$10$aovkHHD8ECniJXxPO8V6x.W98ftViZ6xVWxN3vJrothbbvDfbTgJu', 5, 'Belfast', 'Mon-Fri', 'I have 20 years of experience.'),
(18, 'William Brown', 'will_brown12', 'will_brown@gmail.com', '$2b$10$Zf2iSxNpub1QtKGsIKAzC.nXC2ObBh7Pd5.0FJ97LUpx4lz5lFFRe', 1, 'Banbridge', 'Tues-Sat', 'I am a plumber serving Banbridge and the surrounding areas. Please check my profile for full range of services offered.');

-- --------------------------------------------------------

--
-- Table structure for table `trade_types`
--

CREATE TABLE `trade_types` (
  `trade_type_id` int(11) NOT NULL,
  `trade_type_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trade_types`
--

INSERT INTO `trade_types` (`trade_type_id`, `trade_type_name`) VALUES
(1, 'Plumbing'),
(2, 'Electrical'),
(3, 'Carpentry'),
(4, 'Masonry'),
(5, 'Bricklaying'),
(6, 'Roofing'),
(7, 'Fencing'),
(8, 'Gardening & Landscaping'),
(9, 'Painting & Decorating'),
(10, 'Locksmith'),
(11, 'Handyman'),
(12, 'Plastering');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `FK_services_service_id` (`service_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`rating_id`),
  ADD KEY `FK_trader_id` (`trader_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `FK_traders_trader_id` (`trader_id`);

--
-- Indexes for table `traders`
--
ALTER TABLE `traders`
  ADD PRIMARY KEY (`trader_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `FK_traders_trade_type_id` (`trade_type_id`);

--
-- Indexes for table `trade_types`
--
ALTER TABLE `trade_types`
  ADD PRIMARY KEY (`trade_type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `rating_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `traders`
--
ALTER TABLE `traders`
  MODIFY `trader_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `trade_types`
--
ALTER TABLE `trade_types`
  MODIFY `trade_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FK_services_service_id` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `FK_trader_id` FOREIGN KEY (`trader_id`) REFERENCES `traders` (`trader_id`);

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `FK_traders_trader_id` FOREIGN KEY (`trader_id`) REFERENCES `traders` (`trader_id`);

--
-- Constraints for table `traders`
--
ALTER TABLE `traders`
  ADD CONSTRAINT `FK_traders_trade_type_id` FOREIGN KEY (`trade_type_id`) REFERENCES `trade_types` (`trade_type_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
