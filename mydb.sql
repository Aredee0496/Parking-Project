-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2024 at 08:32 AM
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
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `callshuttle`
--

CREATE TABLE `callshuttle` (
  `CallShuttle_ID` varchar(10) NOT NULL,
  `Shuttle_ID` varchar(10) DEFAULT NULL,
  `Deposit_ID` varchar(10) NOT NULL,
  `People` int(11) NOT NULL,
  `CS_Status_ID` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `callshuttlestatus`
--

CREATE TABLE `callshuttlestatus` (
  `CS_Status_ID` varchar(10) NOT NULL,
  `CS_Status_name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `callshuttlestatus`
--

INSERT INTO `callshuttlestatus` (`CS_Status_ID`, `CS_Status_name`) VALUES
('1', 'เรียกรถ'),
('2', 'สำเร็จ');

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE `car` (
  `Car_ID` varchar(10) NOT NULL,
  `Customer_ID` varchar(10) NOT NULL,
  `RegisterPlateNo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`Car_ID`, `Customer_ID`, `RegisterPlateNo`) VALUES
('CA01', 'C01', 'กข 7979'),
('CA02', 'C01', 'กข 1515'),
('CA05', 'C03', 'งง 2541'),
('CA06', 'C04', 'กก 1254'),
('CA08', 'C05', 'วล 5789'),
('CA09', 'C06', 'กพ 1234'),
('CA10', 'C07', 'กอ 2354'),
('CA11', 'C08', 'งง 2344'),
('CA12', 'C09', 'กล 5656'),
('CA13', 'C10', 'ฏก 7891'),
('CA15', 'C12', 'กอ 2344'),
('CA16', 'C03', 'บล 1234'),
('CA17', 'C04', 'วง 2555');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `Customer_ID` varchar(10) NOT NULL,
  `Customer_Fname` varchar(50) NOT NULL,
  `Customer_Lname` varchar(50) NOT NULL,
  `Customer_Username` varchar(50) DEFAULT NULL,
  `Customer_Password` varchar(50) DEFAULT NULL,
  `Customer_Tel` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`Customer_ID`, `Customer_Fname`, `Customer_Lname`, `Customer_Username`, `Customer_Password`, `Customer_Tel`) VALUES
('C01', 'รุชดีร์', 'บิลล่าเต๊ะ', 'test01', '123456', '0941305135'),
('C03', 'ศราวุฒิ', 'คงอ่อน', 'test03', '123456', '0935784545'),
('C04', 'ภราดรรรร', 'หนูเอียด', 'test2222', '123456', '0935781412'),
('C05', 'ปพนสรรค์', 'พรหมจันทร์', 'test555', '123456', '0818948241'),
('C06', 'สารา', 'มานี', 'cu123', '123456', '0818948241'),
('C07', 'บิ๊ก', 'โคล่า ', 'rr11', 'ss11', '0958746582'),
('C08', 'โค้ก', 'ซีโร่', 'sfsg', 'srzg', '0958746583'),
('C09', 'หนู ', 'ฮกชุน', 'edgrdg', 'dfsbdsfg', '0958746587'),
('C10', 'เหม่ง', 'ปากดำ', 'edgrdgrfrf', 'dfsbdsfgsfsf', '0951236587'),
('C12', 'บาส', 'ครับ', 'bass55', '1234', '0987276357');

-- --------------------------------------------------------

--
-- Table structure for table `deposit`
--

CREATE TABLE `deposit` (
  `Deposit_ID` varchar(10) NOT NULL,
  `Customer_ID` varchar(10) NOT NULL,
  `Type_ID` varchar(10) NOT NULL,
  `Car_ID` varchar(10) DEFAULT NULL,
  `Parking_ID` varchar(10) DEFAULT NULL,
  `Booking_DateTime` datetime DEFAULT NULL,
  `Return_DateTime` datetime DEFAULT NULL,
  `Checkin_DateTime` datetime DEFAULT NULL,
  `Checkout_DateTime` datetime DEFAULT NULL,
  `Officer_ID` varchar(10) DEFAULT NULL,
  `DepositStatus_ID` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deposit`
--

INSERT INTO `deposit` (`Deposit_ID`, `Customer_ID`, `Type_ID`, `Car_ID`, `Parking_ID`, `Booking_DateTime`, `Return_DateTime`, `Checkin_DateTime`, `Checkout_DateTime`, `Officer_ID`, `DepositStatus_ID`) VALUES
('DEP-0001', 'C05', '1', 'CA08', 'P001', '2024-09-10 18:00:00', NULL, '2024-09-07 14:33:52', '2024-09-10 15:05:05', 'OF001', 3),
('DEP-0002', 'C01', '2', 'CA02', 'P006', '2024-09-10 01:01:00', NULL, '2024-09-06 14:34:53', '2024-09-10 15:05:09', 'OF001', 3),
('DEP-0003', 'C03', '1', 'CA16', 'P002', '2024-09-10 16:00:00', NULL, '2024-09-03 14:35:41', '2024-09-10 15:05:08', 'OF001', 3),
('DEP-0004', 'C10', '1', 'CA13', 'P001', NULL, '0000-00-00 00:00:00', '2024-09-02 15:19:02', '2024-09-10 15:21:21', 'OF001', 3),
('DEP-0005', 'C04', '1', 'CA06', 'P002', NULL, '0000-00-00 00:00:00', '2024-09-05 15:19:07', '2024-09-10 15:21:23', 'OF001', 3),
('DEP-0006', 'C06', '1', 'CA09', 'P003', NULL, '0000-00-00 00:00:00', '2024-09-07 15:19:24', '2024-09-10 15:21:24', 'OF001', 3),
('DEP-0007', 'C05', '1', 'CA08', 'P004', NULL, '0000-00-00 00:00:00', '2024-09-08 15:19:30', '2024-09-10 15:21:26', 'OF001', 3),
('DEP-0008', 'C12', '1', 'CA15', 'P005', NULL, '0000-00-00 00:00:00', '2024-09-05 15:19:35', '2024-09-10 15:21:27', 'OF001', 3),
('DEP-0009', 'C07', '2', 'CA10', 'P006', NULL, '0000-00-00 00:00:00', '2024-09-07 15:19:44', '2024-09-10 15:21:28', 'OF001', 3),
('DEP-0010', 'C03', '1', 'CA05', 'P001', '2024-09-11 15:05:00', NULL, '2024-09-11 13:44:08', '2024-09-11 13:44:42', 'OF001', 3),
('DEP-0011', 'C03', '2', 'CA16', 'P006', '2024-09-11 17:01:00', NULL, '2024-09-08 13:45:47', '2024-09-11 13:47:12', 'OF001', 3),
('DEP-0012', 'C01', '1', 'CA01', 'P001', NULL, '0000-00-00 00:00:00', '2024-09-12 21:34:24', '2024-09-26 21:38:57', 'OF001', 3),
('DEP-0013', 'C03', '1', 'CA05', 'P002', NULL, '0000-00-00 00:00:00', '2024-09-12 22:34:32', '2024-09-26 21:39:01', 'OF001', 3),
('DEP-0014', 'C04', '1', 'CA06', 'P003', NULL, '0000-00-00 00:00:00', '2024-09-13 11:34:39', '2024-09-26 21:39:04', 'OF001', 3),
('DEP-0015', 'C05', '1', 'CA08', 'P004', NULL, '0000-00-00 00:00:00', '2024-09-13 17:34:46', '2024-09-26 21:39:06', 'OF001', 3),
('DEP-0016', 'C06', '1', 'CA09', 'P005', NULL, '0000-00-00 00:00:00', '2024-09-23 21:34:55', '2024-09-26 21:39:09', 'OF001', 3),
('DEP-0017', 'C07', '2', 'CA10', 'P006', NULL, '0000-00-00 00:00:00', '2024-09-23 08:35:04', '2024-09-26 21:39:12', 'OF001', 3),
('DEP-0018', 'C08', '2', 'CA11', 'P007', NULL, '0000-00-00 00:00:00', '2024-09-24 15:35:11', '2024-09-26 21:39:15', 'OF001', 3),
('DEP-0019', 'C09', '2', 'CA12', 'P008', NULL, '0000-00-00 00:00:00', '2024-09-26 11:35:21', '2024-09-26 21:39:17', 'OF001', 3),
('DEP-0020', 'C03', '1', 'CA05', 'P001', '2024-09-29 12:00:00', NULL, '2024-09-28 09:22:20', '2024-09-29 09:54:19', 'OF001', 3),
('DEP-0021', 'C01', '1', 'CA02', 'P002', NULL, '0000-00-00 00:00:00', '2024-09-26 09:22:47', '2024-10-02 12:12:03', 'OF001', 3),
('DEP-0022', 'C04', '2', 'CA06', 'P006', '2024-09-29 13:20:00', NULL, '2024-09-29 10:02:57', '2024-10-02 12:12:07', 'OF001', 3),
('DEP-0023', 'C01', '1', 'CA01', 'P001', NULL, '0000-00-00 00:00:00', '2024-10-02 14:06:33', '2024-10-06 14:56:28', 'OF001', 3),
('DEP-0024', 'C03', '1', 'CA05', 'P017', NULL, '0000-00-00 00:00:00', '2024-10-02 14:06:43', '2024-10-06 14:56:31', 'OF001', 3),
('DEP-0025', 'C04', '1', 'CA06', 'P004', NULL, '0000-00-00 00:00:00', '2024-10-02 14:06:51', '2024-10-06 14:56:34', 'OF001', 3),
('DEP-0026', 'C05', '2', 'CA08', 'P010', NULL, '0000-00-00 00:00:00', '2024-10-02 14:06:57', '2024-10-06 14:56:36', 'OF001', 3),
('DEP-0027', 'C06', '2', 'CA09', 'P011', NULL, '0000-00-00 00:00:00', '2024-10-02 14:07:03', '2024-10-06 14:56:40', 'OF001', 3),
('DEP-0029', 'C08', '1', 'CA11', 'P001', NULL, '0000-00-00 00:00:00', '2024-10-06 17:27:19', '2024-10-06 17:27:23', 'OF001', 3),
('DEP-0030', 'C04', '1', 'CA06', 'P001', '2024-10-07 00:00:00', NULL, '2024-10-06 18:03:38', '2024-10-06 18:11:31', 'OF001', 3),
('DEP-0031', 'C04', '2', 'CA06', 'P006', '2024-10-06 18:00:00', NULL, '2024-10-06 18:13:30', '2024-10-06 18:14:14', 'OF001', 3),
('DEP-0032', 'C04', '1', 'CA06', 'P001', NULL, '0000-00-00 00:00:00', '2024-10-06 18:15:14', '2024-10-06 18:16:09', 'OF001', 3),
('DEP-0033', 'C04', '1', 'CA17', 'P001', NULL, '0000-00-00 00:00:00', '2024-10-06 18:21:28', '2024-10-06 18:22:29', 'OF001', 3),
('DEP-0034', 'C04', '1', 'CA17', 'P001', NULL, '0000-00-00 00:00:00', '2024-10-06 18:24:46', '2024-10-06 18:25:17', 'OF001', 3),
('DEP-0035', 'C01', '1', 'CA01', 'P001', NULL, '0000-00-00 00:00:00', '2024-10-06 18:30:10', NULL, 'OF001', 2),
('DEP-0036', 'C04', '1', 'CA17', 'P019', NULL, '0000-00-00 00:00:00', '2024-10-06 18:30:19', '2024-10-07 10:01:51', 'OF001', 3),
('DEP-0037', 'C03', '1', 'CA16', 'P004', NULL, '0000-00-00 00:00:00', '2024-10-06 18:30:26', '2024-10-07 10:08:59', 'OF001', 3),
('DEP-0038', 'C04', '1', 'CA06', 'P002', '2024-10-07 16:00:00', NULL, '2024-10-07 10:05:11', '2024-10-07 10:08:37', 'OF001', 3);

-- --------------------------------------------------------

--
-- Table structure for table `depositstatus`
--

CREATE TABLE `depositstatus` (
  `DepositStatus_ID` int(1) NOT NULL,
  `DepositStatus_name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `depositstatus`
--

INSERT INTO `depositstatus` (`DepositStatus_ID`, `DepositStatus_name`) VALUES
(1, 'จองสำเร็จ'),
(2, 'checkin'),
(3, 'checkout');

-- --------------------------------------------------------

--
-- Table structure for table `officer`
--

CREATE TABLE `officer` (
  `Officer_ID` varchar(10) NOT NULL,
  `Officer_Fname` varchar(50) NOT NULL,
  `Officer_Lname` varchar(50) NOT NULL,
  `Officer_Username` varchar(50) NOT NULL,
  `Officer_Password` varchar(50) NOT NULL,
  `Officer_Tel` varchar(10) NOT NULL,
  `Role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `officer`
--

INSERT INTO `officer` (`Officer_ID`, `Officer_Fname`, `Officer_Lname`, `Officer_Username`, `Officer_Password`, `Officer_Tel`, `Role`) VALUES
('OF001', 'ไบร์ท', 'สุขสว่าง', 'admin1', '123456', '0941521521', 'manager'),
('OF002', 'มนัสวีร์', 'เสรีอัญชัญ', 'admin2', '123456', '0941305135', 'employee'),
('OF003', 'วันว่าน', 'หวานอยู่', 'admin3', '123456', '0945784286', 'employee'),
('OF004', 'Rusdee', 'Billatah', 'mud123', '123456', '0950687880', 'employee');

-- --------------------------------------------------------

--
-- Table structure for table `parking`
--

CREATE TABLE `parking` (
  `Parking_ID` varchar(10) NOT NULL,
  `Type_ID` varchar(10) NOT NULL,
  `PStatus_ID` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parking`
--

INSERT INTO `parking` (`Parking_ID`, `Type_ID`, `PStatus_ID`) VALUES
('P001', '1', '2'),
('P002', '1', '1'),
('P003', '1', '1'),
('P004', '1', '1'),
('P005', '1', '1'),
('P006', '2', '1'),
('P007', '2', '1'),
('P008', '2', '1'),
('P009', '2', '1'),
('P010', '2', '1'),
('P011', '2', '1'),
('P012', '2', '1'),
('P013', '2', '1'),
('P015', '1', '1'),
('P016', '1', '1'),
('P017', '1', '1'),
('P018', '1', '1'),
('P019', '1', '1');

-- --------------------------------------------------------

--
-- Table structure for table `parkingstatus`
--

CREATE TABLE `parkingstatus` (
  `PStatus_ID` varchar(10) NOT NULL,
  `PStatus_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parkingstatus`
--

INSERT INTO `parkingstatus` (`PStatus_ID`, `PStatus_name`) VALUES
('1', 'ว่าง'),
('2', 'ไม่ว่าง'),
('3', 'จอง');

-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--

CREATE TABLE `receipt` (
  `Receipt_ID` varchar(10) NOT NULL,
  `Receipt_DateTime` datetime NOT NULL,
  `Deposit_ID` varchar(10) NOT NULL,
  `Parking_Time` int(10) NOT NULL,
  `Parking_Fee` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `receipt`
--

INSERT INTO `receipt` (`Receipt_ID`, `Receipt_DateTime`, `Deposit_ID`, `Parking_Time`, `Parking_Fee`) VALUES
('0ee99131', '2024-10-06 18:11:31', 'DEP-0030', 1, 20),
('1989c938', '2024-10-06 18:16:09', 'DEP-0032', 1, 20),
('261e8f38', '2024-10-06 18:14:14', 'DEP-0031', 1, 10),
('280619c5', '2024-10-06 14:56:40', 'DEP-0027', 96, 200),
('2ac3f2e5', '2024-10-06 14:56:34', 'DEP-0025', 96, 400),
('2fbdfe91', '2024-10-07 10:01:51', 'DEP-0036', 15, 100),
('32e55c08', '2024-10-07 10:08:59', 'DEP-0037', 15, 100),
('33434d2c', '2024-09-29 09:54:19', 'DEP-0020', 24, 100),
('39118585', '2024-10-06 14:56:37', 'DEP-0026', 96, 200),
('4212b8cf', '2024-10-06 17:27:23', 'DEP-0029', 1, 20),
('4baff1e2', '2024-09-11 13:44:42', 'DEP-0010', 1, 0),
('57c975bf', '2024-09-26 21:38:57', 'DEP-0012', 336, 1386),
('61163ff3', '2024-09-26 21:39:09', 'DEP-0016', 72, 297),
('69f5d61e', '2024-09-11 13:47:12', 'DEP-0011', 72, 150),
('7127f057', '2024-10-06 18:25:17', 'DEP-0034', 1, 20),
('72037e77', '2024-09-26 21:39:18', 'DEP-0019', 10, 50),
('7ee9b746', '2024-10-07 10:08:37', 'DEP-0038', 1, 20),
('7ef118ee', '2024-10-06 18:22:29', 'DEP-0033', 1, 20),
('7f86e49c', '2024-08-25 12:00:00', 'DEP-0008', 120, 495),
('8dccdd0d', '2024-09-26 21:39:04', 'DEP-0014', 322, 1387),
('8ea5c665', '2024-08-30 15:21:26', 'DEP-0007', 48, 198),
('8edc277a', '2024-10-06 14:56:28', 'DEP-0023', 96, 400),
('90cb5fb5', '2024-10-07 10:01:51', 'DEP-0036', 15, 100),
('9e51a453', '2024-10-06 14:56:31', 'DEP-0024', 96, 400),
('a098b740', '2024-10-07 10:01:51', 'DEP-0036', 15, 100),
('ad1d832b', '2024-09-02 15:21:28', 'DEP-0009', 72, 150),
('ba509bdc', '2024-09-26 21:39:12', 'DEP-0017', 85, 200),
('baf7fecc', '2024-10-07 10:01:51', 'DEP-0036', 15, 100),
('be2b6f59', '2024-09-03 15:05:09', 'DEP-0002', 96, 200),
('c8fedf7a', '2024-09-26 21:39:06', 'DEP-0015', 316, 1327),
('cfc92b76', '2024-09-06 15:21:24', 'DEP-0006', 72, 297),
('d1a88875', '2024-09-06 15:21:23', 'DEP-0005', 120, 495),
('d44c3c4c', '2024-09-10 15:05:05', 'DEP-0001', 72, 297),
('d7b5d731', '2024-10-07 10:01:51', 'DEP-0036', 15, 100),
('d8bfdbd6', '2024-10-02 12:12:07', 'DEP-0022', 74, 170),
('e11c1174', '2024-09-26 21:39:01', 'DEP-0013', 335, 1386),
('e66ce8cd', '2024-09-10 15:05:08', 'DEP-0003', 168, 693),
('ea0b0f66', '2024-10-02 12:12:04', 'DEP-0021', 146, 640),
('eb7a9d55', '2024-09-26 21:39:15', 'DEP-0018', 54, 150),
('f82c8dd5', '2024-09-10 15:21:21', 'DEP-0004', 192, 792);

-- --------------------------------------------------------

--
-- Table structure for table `shuttle`
--

CREATE TABLE `shuttle` (
  `Shuttle_ID` varchar(10) NOT NULL,
  `RegisterPlateNo` varchar(10) NOT NULL,
  `Type` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shuttle`
--

INSERT INTO `shuttle` (`Shuttle_ID`, `RegisterPlateNo`, `Type`) VALUES
('Shuttle-01', 'กอ 2311', 'กระบะ'),
('Shuttle-02', 'กพ 1255', 'เก๋ง');

-- --------------------------------------------------------

--
-- Table structure for table `type`
--

CREATE TABLE `type` (
  `Type_ID` varchar(10) NOT NULL,
  `Type_name` varchar(50) NOT NULL,
  `Price_Hour` double NOT NULL,
  `Price_Day` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `type`
--

INSERT INTO `type` (`Type_ID`, `Type_name`, `Price_Hour`, `Price_Day`) VALUES
('1', 'ในร่ม', 20, 100),
('2', 'กลางแจ้ง', 10, 50);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `callshuttle`
--
ALTER TABLE `callshuttle`
  ADD PRIMARY KEY (`CallShuttle_ID`),
  ADD KEY `fk_callshuttle_deposit_idx` (`Deposit_ID`),
  ADD KEY `fk_callshuttle_callshuttlestatus_idx` (`CS_Status_ID`),
  ADD KEY `fk_callshuttle_shuttle_idx` (`Shuttle_ID`);

--
-- Indexes for table `callshuttlestatus`
--
ALTER TABLE `callshuttlestatus`
  ADD PRIMARY KEY (`CS_Status_ID`);

--
-- Indexes for table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`Car_ID`),
  ADD KEY `fk_car_customer_idx` (`Customer_ID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`Customer_ID`);

--
-- Indexes for table `deposit`
--
ALTER TABLE `deposit`
  ADD PRIMARY KEY (`Deposit_ID`),
  ADD KEY `fk_deposit_customer_idx` (`Customer_ID`),
  ADD KEY `fk_deposit_car_idx` (`Car_ID`),
  ADD KEY `fk_deposit_parking_idx` (`Parking_ID`),
  ADD KEY `fk_deposit_officer_idx` (`Officer_ID`),
  ADD KEY `fk_deposit_type` (`Type_ID`),
  ADD KEY `fk_deposit_depositstatus` (`DepositStatus_ID`);

--
-- Indexes for table `depositstatus`
--
ALTER TABLE `depositstatus`
  ADD PRIMARY KEY (`DepositStatus_ID`);

--
-- Indexes for table `officer`
--
ALTER TABLE `officer`
  ADD PRIMARY KEY (`Officer_ID`),
  ADD UNIQUE KEY `Officer_ID_UNIQUE` (`Officer_ID`),
  ADD UNIQUE KEY `Officer_Username_UNIQUE` (`Officer_Username`);

--
-- Indexes for table `parking`
--
ALTER TABLE `parking`
  ADD PRIMARY KEY (`Parking_ID`),
  ADD KEY `fk_parking_type_idx` (`Type_ID`),
  ADD KEY `fk_parking_parkingstatus_idx` (`PStatus_ID`);

--
-- Indexes for table `parkingstatus`
--
ALTER TABLE `parkingstatus`
  ADD PRIMARY KEY (`PStatus_ID`);

--
-- Indexes for table `receipt`
--
ALTER TABLE `receipt`
  ADD PRIMARY KEY (`Receipt_ID`),
  ADD UNIQUE KEY `Receipt_ID_UNIQUE` (`Receipt_ID`),
  ADD KEY `fk_recript_deposit_idx` (`Deposit_ID`);

--
-- Indexes for table `shuttle`
--
ALTER TABLE `shuttle`
  ADD PRIMARY KEY (`Shuttle_ID`);

--
-- Indexes for table `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`Type_ID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `callshuttle`
--
ALTER TABLE `callshuttle`
  ADD CONSTRAINT `fk_callshuttle_callshuttlestatus` FOREIGN KEY (`CS_Status_ID`) REFERENCES `callshuttlestatus` (`CS_Status_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_callshuttle_deposit` FOREIGN KEY (`Deposit_ID`) REFERENCES `deposit` (`Deposit_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_callshuttle_shuttle` FOREIGN KEY (`Shuttle_ID`) REFERENCES `shuttle` (`Shuttle_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `car`
--
ALTER TABLE `car`
  ADD CONSTRAINT `fk_car_customer` FOREIGN KEY (`Customer_ID`) REFERENCES `customer` (`Customer_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `deposit`
--
ALTER TABLE `deposit`
  ADD CONSTRAINT `fk_deposit_car` FOREIGN KEY (`Car_ID`) REFERENCES `car` (`Car_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_deposit_customer` FOREIGN KEY (`Customer_ID`) REFERENCES `customer` (`Customer_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_deposit_depositstatus` FOREIGN KEY (`DepositStatus_ID`) REFERENCES `depositstatus` (`DepositStatus_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_deposit_officer` FOREIGN KEY (`Officer_ID`) REFERENCES `officer` (`Officer_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_deposit_parking` FOREIGN KEY (`Parking_ID`) REFERENCES `parking` (`Parking_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_deposit_type` FOREIGN KEY (`Type_ID`) REFERENCES `type` (`Type_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `parking`
--
ALTER TABLE `parking`
  ADD CONSTRAINT `fk_parking_parkingstatus` FOREIGN KEY (`PStatus_ID`) REFERENCES `parkingstatus` (`PStatus_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_parking_type` FOREIGN KEY (`Type_ID`) REFERENCES `type` (`Type_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `receipt`
--
ALTER TABLE `receipt`
  ADD CONSTRAINT `fk_recript_deposit` FOREIGN KEY (`Deposit_ID`) REFERENCES `deposit` (`Deposit_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
