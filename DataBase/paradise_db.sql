-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 05, 2021 at 10:08 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `paradise_db`
--
CREATE DATABASE paradise_db

-- --------------------------------------------------------

--
-- Table structure for table `LOTS`
--

CREATE TABLE `LOTS` (
  `lot_ID` int(11) NOT NULL,
  `Pday` int(11) NOT NULL,
  `spot_count` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `LOTS`
--

INSERT INTO `LOTS` (`lot_ID`, `Pday`, `spot_count`, `type`) VALUES
(1, 5, '4', 'TENT'),
(2, 5, '4', 'TENT'),
(3, 5, '4', 'TENT'),
(4, 6, '4', 'TENT'),
(5, 6, '4', 'TENT'),
(6, 5, '4', 'TENT'),
(7, 5, '4', 'TENT'),
(8, 5, '4', 'TENT'),
(9, 5, '4', 'TENT'),
(10, 15, '1', 'RV'),
(11, 15, '1', 'RV'),
(12, 15, '1', 'RV'),
(13, 15, '1', 'RV'),
(14, 15, '1', 'RV'),
(15, 15, '1', 'RV'),
(16, 15, '1', 'RV'),
(17, 20, '1', 'RV'),
(18, 20, '1', 'RV');

-- --------------------------------------------------------

--
-- Table structure for table `Reservations`
--

CREATE TABLE `Reservations` (
  `ref_num` int(11) NOT NULL,
  `Stat` varchar(45) NOT NULL,
  `Darrival` date NOT NULL,
  `Ddepart` date NOT NULL,
  `ppl_count` int(11) NOT NULL,
  `tent_rent` int(11) NOT NULL,
  `USERID` int(11) NOT NULL,
  `lot` int(11) NOT NULL,
  `Tent_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Reservations`
--

INSERT INTO `Reservations` (`ref_num`, `Stat`, `Darrival`, `Ddepart`, `ppl_count`, `tent_rent`, `USERID`, `lot`, `Tent_count`) VALUES
(1, 'ACTIVE', '2021-07-05', '2021-07-10', 4, 0, 2, 1, 4),
(2, 'ACTIVE', '2021-07-03', '2021-07-15', 2, 0, 3, 3, 3),
(3, 'CANCELED', '2021-10-23', '2021-11-01', 4, 0, 8, 5, 4),
(4, 'CANCELED', '2021-12-15', '2021-12-28', 7, 1, 8, 3, 3),
(6, 'CANCELED', '2011-11-11', '2011-11-15', 1, 0, 8, 1, 1),
(7, 'CANCELED', '2011-11-11', '2011-11-15', 1, 0, 8, 2, 1),
(8, 'CANCELED', '2011-11-11', '2011-11-15', 1, 0, 8, 3, 1),
(9, 'CANCELED', '2011-11-11', '2011-11-15', 1, 0, 8, 4, 1),
(10, 'ACTIVE', '2011-11-15', '2011-11-20', 1, 0, 8, 5, 1),
(11, 'ACTIVE', '2011-11-15', '2011-11-20', 1, 0, 8, 6, 1),
(12, 'ACTIVE', '2011-11-15', '2011-11-20', 1, 0, 8, 7, 1),
(18, 'ACTIVE', '2011-11-16', '2011-11-19', 4, 0, 8, 3, 2),
(19, 'ACTIVE', '2021-06-18', '2021-06-28', 4, 0, 8, 1, 4),
(20, 'ACTIVE', '2021-06-18', '2021-06-28', 4, 0, 8, 2, 4),
(21, 'ACTIVE', '2021-06-18', '2021-06-28', 4, 0, 8, 10, 0),
(22, 'ACTIVE', '2021-06-27', '2021-06-29', 1, 0, 8, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `usser`
--

CREATE TABLE `usser` (
  `idUSER` int(11) NOT NULL,
  `fname` varchar(45) NOT NULL,
  `lname` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `secterKey` varchar(255) NOT NULL,
  `Role` varchar(45) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `isACamper` tinyint(4) DEFAULT NULL,
  `livesIn` int(11) DEFAULT NULL,
  `bday` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `usser`
--

INSERT INTO `usser` (`idUSER`, `fname`, `lname`, `email`, `secterKey`, `Role`, `phone`, `isACamper`, `livesIn`, `bday`) VALUES
(1, 'Nikos', 'Koukos', 'koukos@gmail.com', 'secret', 'ADMIN', '+30261078564', 0, NULL, '1960-05-13'),
(2, 'Tao', 'Pa', 'taopa@gmail.com', 'secret', 'USER', '+30261078554', 0, NULL, '1965-08-15'),
(3, 'Lao', 'Ko', 'Laoko@gmail.com', 'secret', 'USER', '+30261478554', 0, NULL, '1975-08-15'),
(4, 'Maria', 'Soupia', 'marias@gmail.com', 'secret', 'USER', '+306857463', 0, NULL, '1990-04-05'),
(5, 'Kwstas', 'Tsiris', 'tiris@gmail.com', 'secret', 'USER', '+306fd7463', 0, NULL, '1994-07-07'),
(6, 'Makis', 'Panagotas', 'makis@gmail.com', 'secret', 'USER', NULL, 0, NULL, '1990-05-06'),
(8, 'Jonh', 'Loupis', 'loupis@gmail.com', '1', 'ADMIN', 'NULL', 0, NULL, '1996-06-05'),
(14, 'Nick', 'Hard', 'hard@gmail.com', 'secret', 'USER', 'NULL', 0, NULL, '1995-03-05'),
(15, 'Κώστας', 'Καρής', 'karis@mail.com', '1', 'USER', 'NULL', 0, NULL, '1980-11-11'),
(16, 'Kostas', 'Karis', 'karis@gmail.com', '1', 'USER', 'NULL', 0, NULL, '1990-11-11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `LOTS`
--
ALTER TABLE `LOTS`
  ADD PRIMARY KEY (`lot_ID`),
  ADD UNIQUE KEY `lot_ID_UNIQUE` (`lot_ID`);

--
-- Indexes for table `Reservations`
--
ALTER TABLE `Reservations`
  ADD PRIMARY KEY (`ref_num`),
  ADD KEY `lots_ibfk_` (`lot`) USING BTREE,
  ADD KEY `USER_ID_ufk` (`USERID`);

--
-- Indexes for table `usser`
--
ALTER TABLE `usser`
  ADD PRIMARY KEY (`idUSER`),
  ADD KEY `lot_ID_ibfk_` (`livesIn`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `LOTS`
--
ALTER TABLE `LOTS`
  MODIFY `lot_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `Reservations`
--
ALTER TABLE `Reservations`
  MODIFY `ref_num` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `usser`
--
ALTER TABLE `usser`
  MODIFY `idUSER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Reservations`
--
ALTER TABLE `Reservations`
  ADD CONSTRAINT `USER_ID_ufk` FOREIGN KEY (`USERID`) REFERENCES `usser` (`idUSER`),
  ADD CONSTRAINT `lots_FK` FOREIGN KEY (`lot`) REFERENCES `LOTS` (`lot_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `usser`
--
ALTER TABLE `usser`
  ADD CONSTRAINT `lot_ID` FOREIGN KEY (`livesIn`) REFERENCES `LOTS` (`lot_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
