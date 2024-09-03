-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2024 at 07:46 PM
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
('CA16', 'C03', 'บล 1234');

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
('C04', 'ภราดร', 'หนูเอียด', 'test2222', '123456', '0935781412'),
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
('DEP-0001', 'C01', '1', 'CA02', 'P002', '2024-09-07 00:00:00', NULL, '2024-09-03 17:11:49', NULL, 'OF001', 2);

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
('OF001', 'ชูใจ', 'ใยดี', 'admin1', '123456', '0941521521', 'manager'),
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
('P002', '1', '2'),
('P003', '1', '1'),
('P004', '1', '1'),
('P005', '1', '1'),
('P006', '2', '2'),
('P007', '2', '1'),
('P008', '2', '1'),
('P009', '2', '1'),
('P010', '2', '1'),
('P011', '2', '1'),
('P012', '2', '1'),
('P013', '2', '1'),
('P014', '2', '1'),
('P015', '2', '1');

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
  `Deposit_ID` varchar(10) NOT NULL,
  `Parking_Time` varchar(10) NOT NULL,
  `Parking_Fee` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
('1', 'ในร่ม', 10, 99),
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
