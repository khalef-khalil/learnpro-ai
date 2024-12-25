-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 25, 2024 at 02:22 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `assistant`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_text` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(1, 1, '4', 1),
(2, 1, '3', 0),
(3, 1, '5', 0),
(4, 1, '6', 0),
(5, 2, '2x', 1),
(6, 2, 'x', 0),
(7, 2, 'x^2', 0),
(8, 2, '1', 0),
(9, 3, '2', 1),
(10, 3, '3', 0),
(11, 3, '1', 0),
(12, 3, '4', 0),
(13, 4, 'F = ma', 1),
(14, 4, 'E = mc^2', 0),
(15, 4, 'V = IR', 0),
(16, 4, 'P = F/A', 0),
(17, 5, 'Velocity is speed with direction; acceleration is the rate of change of velocity.', 1),
(18, 5, 'Velocity is the same as speed; acceleration is a force.', 0),
(19, 5, 'Velocity is a scalar; acceleration is a vector.', 0),
(20, 5, 'Velocity and acceleration are the same.', 0),
(21, 6, '1', 1),
(22, 6, '2', 0),
(23, 6, '0', 0),
(24, 6, '8', 0),
(25, 7, 'Deoxyribonucleic Acid', 1),
(26, 7, 'Dynamic Neural Analysis', 0),
(27, 7, 'Digital Numerical Array', 0),
(28, 7, 'Data Network Access', 0),
(29, 8, 'A container for storing data values.', 1),
(30, 8, 'A fixed value in a program.', 0),
(31, 8, 'A reserved word in Python.', 0),
(32, 8, 'A function in Python.', 0),
(33, 9, '2', 1),
(34, 9, '2.5', 0),
(35, 9, '5', 0),
(36, 9, '1', 0),
(37, 10, '4', 1),
(38, 10, '2', 0),
(39, 10, '8', 0),
(40, 10, '16', 0),
(41, 11, '2x + 6', 1),
(42, 11, '3x + 6', 0),
(43, 11, '4x', 0),
(44, 11, 'x - 6', 0),
(45, 12, 'x = ±2', 1),
(46, 12, 'x = 2', 0),
(47, 12, 'x = -2', 0),
(48, 12, 'x = 0', 0),
(49, 13, 'cos(x)', 1),
(50, 13, 'sin(x)', 0),
(51, 13, 'tan(x)', 0),
(52, 13, '-sin(x)', 0),
(53, 14, 'x^4/4 + C', 1),
(54, 14, '4x^3 + C', 0),
(55, 14, 'x^3/3 + C', 0),
(56, 14, 'x^4 + C', 0),
(57, 15, '3 x 10^8 m/s', 1),
(58, 15, '3 x 10^7 m/s', 0),
(59, 15, '1 x 10^8 m/s', 0),
(60, 15, '5 x 10^8 m/s', 0),
(61, 16, 'Resistance to change in motion', 1),
(62, 16, 'Tendency to accelerate', 0),
(63, 16, 'Force acting on an object', 0),
(64, 16, 'Friction between surfaces', 0),
(65, 17, 'Ampere', 1),
(66, 17, 'Volt', 0),
(67, 17, 'Coulomb', 0),
(68, 17, 'Ohm', 0),
(69, 18, '196 J', 1),
(70, 18, '200 J', 0),
(71, 18, '100 J', 0),
(72, 18, '150 J', 0),
(73, 19, 'Emission of electrons from a metal surface under light', 1),
(74, 19, 'Reflection of light from a surface', 0),
(75, 19, 'Absorption of light by atoms', 0),
(76, 19, 'Deflection of light rays', 0),
(77, 20, 'Na', 1),
(78, 20, 'N', 0),
(79, 20, 'S', 0),
(80, 20, 'Na2', 0),
(81, 21, '6.022 x 10^23', 1),
(82, 21, '3.14 x 10^8', 0),
(83, 21, '9.8 x 10^3', 0),
(84, 21, '1.602 x 10^-19', 0),
(85, 22, 'M = moles/volume', 1),
(86, 22, 'M = volume/moles', 0),
(87, 22, 'M = mass/volume', 0),
(88, 22, 'M = moles x volume', 0),
(89, 23, 'Valence Shell Electron Pair Repulsion', 1),
(90, 23, 'Electron Sharing Theory', 0),
(91, 23, 'Molecular Orbital Theory', 0),
(92, 23, 'Lewis Structure Model', 0),
(93, 24, 'sp^3', 1),
(94, 24, 'sp^2', 0),
(95, 24, 'sp', 0),
(96, 24, 'sp^3d', 0),
(97, 25, 'Cell', 1),
(98, 25, 'Tissue', 0),
(99, 25, 'Organ', 0),
(100, 25, 'Nucleus', 0),
(101, 26, 'Photosynthesis', 1),
(102, 26, 'Respiration', 0),
(103, 26, 'Transpiration', 0),
(104, 26, 'Fermentation', 0),
(105, 27, 'Powerhouse of the cell', 1),
(106, 27, 'Controls cell division', 0),
(107, 27, 'Synthesizes proteins', 0),
(108, 27, 'Stores genetic material', 0),
(109, 28, 'Neutralize pathogens', 1),
(110, 28, 'Transport oxygen', 0),
(111, 28, 'Generate energy', 0),
(112, 28, 'Store fat', 0),
(113, 29, 'Carry amino acids to ribosomes', 1),
(114, 29, 'Synthesize proteins', 0),
(115, 29, 'Store genetic information', 0),
(116, 29, 'Break down waste', 0),
(117, 30, '6', 1),
(118, 30, '12', 0),
(119, 30, '8', 0),
(120, 30, '10', 0),
(121, 31, 'H2O', 1),
(122, 31, 'CO2', 0),
(123, 31, 'NaCl', 0),
(124, 31, 'CH4', 0),
(125, 32, 'The amount of substance containing Avogadro\'s number of particles.', 1),
(126, 32, 'A unit of mass.', 0),
(127, 32, 'A type of reaction.', 0),
(128, 32, 'A measure of energy.', 0),
(129, 33, '7', 1),
(130, 33, '1', 0),
(131, 33, '14', 0),
(132, 33, '0', 0),
(133, 34, 'The process of decomposing a substance using electricity.', 1),
(134, 34, 'Mixing of two substances.', 0),
(135, 34, 'Burning of a substance.', 0),
(136, 34, 'Freezing of water.', 0),
(137, 35, 'The process of cleaning and organizing raw data.', 1),
(138, 35, 'A type of machine learning.', 0),
(139, 35, 'A visualization technique.', 0),
(140, 35, 'A data storage technique.', 0),
(141, 36, 'When a model performs well on training data but poorly on unseen data.', 1),
(142, 36, 'When a model performs equally on all data.', 0),
(143, 36, 'A method of regularization.', 0),
(144, 36, 'An optimization technique.', 0),
(145, 37, 'Supervised learning uses labeled data; unsupervised learning uses unlabeled data.', 1),
(146, 37, 'Both use labeled data.', 0),
(147, 37, 'Both use unsupervised data.', 0),
(148, 37, 'Supervised learning uses neural networks exclusively.', 0),
(149, 38, 'Matplotlib', 1),
(150, 38, 'NumPy', 0),
(151, 38, 'TensorFlow', 0),
(152, 38, 'Hadoop', 0),
(153, 39, 'To normalize feature values for better model performance.', 1),
(154, 39, 'To increase the size of the dataset.', 0),
(155, 39, 'To make data easier to visualize.', 0),
(156, 39, 'To encode categorical features.', 0),
(157, 40, 'George Washington', 1),
(158, 40, 'Abraham Lincoln', 0),
(159, 40, 'Thomas Jefferson', 0),
(160, 40, 'John Adams', 0),
(161, 41, '1945', 1),
(162, 41, '1918', 0),
(163, 41, '1939', 0),
(164, 41, '1961', 0),
(165, 42, 'Economic disparity and political unrest.', 1),
(166, 42, 'World War I.', 0),
(167, 42, 'The abolition of slavery.', 0),
(168, 42, 'The Cold War.', 0),
(169, 43, 'Urbanization and technological progress.', 1),
(170, 43, 'The rise of feudalism.', 0),
(171, 43, 'The Great Depression.', 0),
(172, 43, 'Deindustrialization.', 0),
(173, 44, 'A geopolitical conflict between the USA and the USSR after WWII.', 1),
(174, 44, 'A period of industrialization.', 0),
(175, 44, 'The rise of Napoleon.', 0),
(176, 44, 'The American Civil War.', 0),
(177, 45, 'William Shakespeare', 1),
(178, 45, 'Charles Dickens', 0),
(179, 45, 'Jane Austen', 0),
(180, 45, 'Mark Twain', 0),
(181, 46, 'Totalitarianism and surveillance.', 1),
(182, 46, 'Romance and love.', 0),
(183, 46, 'Comedy and satire.', 0),
(184, 46, 'Travel and exploration.', 0),
(185, 47, 'Metaphor', 1),
(186, 47, 'Iron.', 0),
(187, 47, 'React.', 0),
(188, 47, 'Plastic.', 0),
(189, 48, 'A 14-line poem with a specific rhyme scheme.', 1),
(190, 48, 'A free verse poem.', 0),
(191, 48, 'A novel.', 0),
(192, 48, 'A play.', 0),
(193, 49, 'A narrative technique that mimics thought patterns.', 1),
(194, 49, 'A genre of science fiction.', 0),
(195, 49, 'A type of dialogue.', 0),
(196, 49, 'A historical account.', 0),
(197, 50, 'HyperText Markup Language', 1),
(198, 50, 'Hyperlink Transfer Protocol', 0),
(199, 50, 'High-Level Text Markup', 0),
(200, 50, 'Hierarchical Text Mapping Language', 0),
(201, 51, 'O(log n)', 1),
(202, 51, 'O(n)', 0),
(203, 51, 'O(1)', 0),
(204, 51, 'O(n^2)', 0),
(205, 52, 'A stack follows LIFO, while a queue follows FIFO.', 1),
(206, 52, 'A stack and a queue are the same.', 0),
(207, 52, 'A stack is faster than a queue.', 0),
(208, 52, 'A stack uses more memory than a queue.', 0),
(209, 53, 'def', 1),
(210, 53, 'function', 0),
(211, 53, 'func', 0),
(212, 53, 'define', 0),
(213, 54, 'A function that calls itself to solve smaller subproblems.', 1),
(214, 54, 'A function that iterates through loops.', 0),
(215, 54, 'A function without a return value.', 0),
(216, 54, 'A method of optimizing code.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `assessments`
--

CREATE TABLE `assessments` (
  `id` int(11) NOT NULL,
  `score` float NOT NULL,
  `logged_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessments`
--

INSERT INTO `assessments` (`id`, `score`, `logged_at`) VALUES
(38, 72, '2024-12-19 19:24:45'),
(39, 84, '2024-12-19 19:33:39'),
(40, 50, '2024-12-19 19:34:52'),
(41, 81, '2024-12-19 19:38:05'),
(42, 72, '2024-12-20 07:26:14'),
(43, 56, '2024-12-23 16:23:51'),
(44, 66, '2024-12-25 01:03:16');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `topic_id` int(11) NOT NULL,
  `difficulty_level` enum('beginner','intermediate','advanced') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `question_text`, `topic_id`, `difficulty_level`) VALUES
(1, 'What is 2+2?', 1, 'beginner'),
(2, 'What is the derivative of x^2?', 1, 'beginner'),
(3, 'Solve for x: 2x + 3 = 7.', 1, 'beginner'),
(4, 'What is Newton\'s second law of motion?', 3, 'beginner'),
(5, 'Define velocity and acceleration.', 3, 'beginner'),
(6, 'What is the atomic number of hydrogen?', 3, 'beginner'),
(7, 'What is DNA?', 5, 'beginner'),
(8, 'What is a variable in Python?', 2, 'beginner'),
(9, 'What is the output of 5 // 2 in Python?', 2, 'beginner'),
(10, 'What is the square root of 16?', 1, 'beginner'),
(11, 'Simplify: (3x + 2) - (x - 4).', 1, 'beginner'),
(12, 'Solve for x: x^2 - 4 = 0.', 1, 'intermediate'),
(13, 'Find the derivative of sin(x).', 1, 'intermediate'),
(14, 'Evaluate the integral of x^3 dx.', 1, 'advanced'),
(15, 'What is the speed of light in a vacuum?', 3, 'beginner'),
(16, 'Define inertia.', 3, 'beginner'),
(17, 'What is the unit of electric current?', 3, 'intermediate'),
(18, 'Calculate the potential energy of a 2 kg mass at a height of 10 m.', 3, 'intermediate'),
(19, 'Describe the photoelectric effect.', 3, 'advanced'),
(20, 'What is the chemical symbol for sodium?', 3, 'beginner'),
(21, 'What is Avogadro\'s number?', 3, 'beginner'),
(22, 'What is the formula for calculating molarity?', 3, 'intermediate'),
(23, 'Describe the VSEPR theory.', 3, 'intermediate'),
(24, 'What is the hybridization of the carbon atom in methane?', 3, 'advanced'),
(25, 'What is the basic unit of life?', 5, 'beginner'),
(26, 'Name the process by which plants make food.', 5, 'beginner'),
(27, 'What is the main function of mitochondria?', 5, 'intermediate'),
(28, 'Explain the role of antibodies in the immune system.', 5, 'intermediate'),
(29, 'What is the function of tRNA during protein synthesis?', 5, 'advanced'),
(30, 'What is the atomic number of carbon?', 4, 'beginner'),
(31, 'What is the chemical formula for water?', 4, 'beginner'),
(32, 'Define the concept of mole in chemistry.', 4, 'intermediate'),
(33, 'What is the pH of a neutral solution?', 4, 'intermediate'),
(34, 'Describe the process of electrolysis.', 4, 'advanced'),
(35, 'What is data wrangling?', 6, 'beginner'),
(36, 'Define the concept of overfitting in machine learning.', 6, 'intermediate'),
(37, 'What is the difference between supervised and unsupervised learning?', 6, 'intermediate'),
(38, 'Name a popular library for data visualization in Python.', 6, 'beginner'),
(39, 'Explain the significance of feature scaling.', 6, 'advanced'),
(40, 'Who was the first President of the United States?', 7, 'beginner'),
(41, 'What year did World War II end?', 7, 'beginner'),
(42, 'Describe the main cause of the French Revolution.', 7, 'intermediate'),
(43, 'Name one effect of the Industrial Revolution.', 7, 'intermediate'),
(44, 'What was the Cold War?', 7, 'advanced'),
(45, 'Who wrote \"Romeo and Juliet\"?', 8, 'beginner'),
(46, 'What is the theme of \"1984\" by George Orwell?', 8, 'intermediate'),
(47, 'Name one literary device used in poetry.', 8, 'beginner'),
(48, 'What is a sonnet?', 8, 'intermediate'),
(49, 'Explain the term \"stream of consciousness\" in literature.', 8, 'advanced'),
(50, 'What does HTML stand for?', 2, 'beginner'),
(51, 'What is the time complexity of binary search?', 2, 'intermediate'),
(52, 'Explain the difference between a stack and a queue.', 2, 'intermediate'),
(53, 'Which keyword is used to define a function in Python?', 2, 'beginner'),
(54, 'What is recursion in programming?', 2, 'advanced');

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `resource_type` enum('video','article','exercise') NOT NULL,
  `url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `difficulty_level` enum('beginner','intermediate','advanced') NOT NULL,
  `topic_id` int(11) DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `title`, `resource_type`, `url`, `description`, `difficulty_level`, `topic_id`, `is_completed`, `completed_at`) VALUES
(1, 'Abstract Algebra Basics Video', 'video', 'https://example.com/algebra-basics', 'An introductory video on algebra and group theory.', 'beginner', 1, 1, '2024-12-19 09:25:42'),
(2, 'Advanced Calculus Article', 'article', 'https://example.com/calculus-advanced', 'Detailed explanation of advanced calculus concepts.', 'advanced', 1, 1, '2024-12-19 10:27:07'),
(3, 'Geometry Practice Exercises', 'exercise', 'https://example.com/geometry-exercises', 'Interactive geometry exercises for practice.', 'intermediate', 1, 1, '2024-12-19 10:40:14'),
(4, 'Mechanics Crash Course', 'video', 'https://example.com/mechanics-course', 'Basics of mechanics for beginners.', 'beginner', 2, 1, '2024-12-19 10:09:48'),
(5, 'Thermodynamics Exercises', 'exercise', 'https://example.com/thermodynamics-exercises', 'Practice exercises on thermodynamics.', 'intermediate', 2, 1, '2024-12-19 10:31:25'),
(6, 'Optics Advanced Problems', 'article', 'https://example.com/optics-problems', 'Challenging problems in optics.', 'advanced', 2, 1, '2024-12-19 14:12:48'),
(7, 'Introduction to Organic Chemistry', 'video', 'https://example.com/organic-chemistry', 'Learn the fundamentals of organic chemistry.', 'beginner', 3, 1, '2024-12-20 07:29:31'),
(8, 'Physical Chemistry Exercises', 'exercise', 'https://example.com/physical-chemistry-exercises', 'Exercises to strengthen concepts in physical chemistry.', 'intermediate', 3, 1, '2024-12-19 19:39:20'),
(9, 'Inorganic Chemistry Deep Dive', 'article', 'https://example.com/inorganic-chemistry', 'Comprehensive detailed guide to inorganic chemistry.', 'advanced', 3, NULL, NULL),
(10, 'Genetics Fundamentals Video', 'video', 'https://example.com/genetics-basics', 'Understanding the basics of genetics.', 'beginner', 4, NULL, NULL),
(11, 'Molecular Biology Exercises', 'exercise', 'https://example.com/molecular-biology-exercises', 'Practice questions on molecular biology.', 'intermediate', 4, 1, '2024-12-19 19:26:00'),
(12, 'Evolution Advanced Concepts', 'article', 'https://example.com/evolution-concepts', 'In-depth article on evolution.', 'advanced', 4, NULL, NULL),
(13, 'Python for Beginners', 'video', 'https://example.com/python-beginners', 'Introductory video on Python programming.', 'beginner', 5, 1, '2024-12-23 16:24:48'),
(14, 'JavaScript Exercises', 'exercise', 'https://example.com/javascript-exercises', 'Practice exercises for JavaScript.', 'intermediate', 5, NULL, NULL),
(15, 'Advanced Algorithm Design', 'article', 'https://example.com/algorithm-design', 'Advanced concepts in algorithm design.', 'advanced', 5, NULL, NULL),
(16, 'Introductory video on basic statistics.', 'video', 'https://example.com/statistics-basics', 'Essential statistics basics video.', 'beginner', 6, NULL, NULL),
(17, 'Machine Learning Exercises', 'exercise', 'https://example.com/ml-exercises', 'Interactive exercises on machine learning.', 'intermediate', 6, 1, '2024-12-20 07:30:47'),
(18, 'Data Visualization Techniques', 'article', 'https://example.com/data-visualization', 'Detailed guide to advanced data visualization.', 'advanced', 6, NULL, NULL),
(19, 'Comprehensive world history overview.', 'video', 'https://example.com/world-history', 'Detailed summary of world history.', 'beginner', 7, 1, '2024-12-19 09:18:46'),
(20, 'Ancient Civilizations Exercises', 'exercise', 'https://example.com/ancient-civilizations', 'Practice exercises on ancient civilizations.', 'intermediate', 7, 1, '2024-12-19 10:27:36'),
(21, 'Critical modern events analysis.', 'article', 'https://example.com/modern-events', 'Thorough in-depth analysis of modern events.', 'advanced', 7, NULL, NULL),
(22, 'Introduction to Shakespeare', 'video', 'https://example.com/shakespeare-intro', 'Beginner\'s guide to Shakespeare\'s works.', 'beginner', 8, NULL, NULL),
(23, 'Poetry Analysis Exercises', 'exercise', 'https://example.com/poetry-analysis', 'Interactive exercises on analyzing poetry.', 'intermediate', 8, NULL, NULL),
(24, 'Exploration of modern literary trends.', 'article', 'https://example.com/modern-literature', 'Insightful discussion of modern literary trends.', 'advanced', 8, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `name`, `description`) VALUES
(1, 'Math', 'Covers topics like algebra, calculus, and geometry.'),
(2, 'Programming', 'Learn Python, JavaScript, and more.'),
(3, 'Physics', 'Includes mechanics, thermodynamics, and optics.'),
(4, 'Chemistry', 'Focuses on organic, inorganic, and physical chemistry.'),
(5, 'Biology', 'Covers molecular biology, genetics, and evolution.'),
(6, 'Data Science', 'Focuses on machine learning, statistics, and visualization.'),
(7, 'History', 'Covers world history, ancient civilizations, and modern events.'),
(8, 'Literature', 'Analyzes classic and contemporary literary works.');

-- --------------------------------------------------------

--
-- Table structure for table `topic_assessment_logs`
--

CREATE TABLE `topic_assessment_logs` (
  `id` int(11) NOT NULL,
  `topic_id` int(11) DEFAULT NULL,
  `assessment_id` int(11) DEFAULT NULL,
  `score` float NOT NULL,
  `logged_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topic_assessment_logs`
--

INSERT INTO `topic_assessment_logs` (`id`, `topic_id`, `assessment_id`, `score`, `logged_at`) VALUES
(217, 1, 38, 100, '2024-12-19 19:24:45'),
(218, 5, 38, 50, '2024-12-19 19:24:45'),
(219, 2, 38, 50, '2024-12-19 19:24:45'),
(220, 3, 38, 50, '2024-12-19 19:24:45'),
(221, 4, 38, 100, '2024-12-19 19:24:45'),
(222, 6, 38, 75, '2024-12-19 19:24:45'),
(223, 7, 38, 75, '2024-12-19 19:24:45'),
(224, 8, 38, 75, '2024-12-19 19:24:45'),
(225, 1, 39, 75, '2024-12-19 19:33:39'),
(226, 5, 39, 75, '2024-12-19 19:33:39'),
(227, 2, 39, 100, '2024-12-19 19:33:39'),
(228, 3, 39, 100, '2024-12-19 19:33:39'),
(229, 4, 39, 75, '2024-12-19 19:33:39'),
(230, 6, 39, 75, '2024-12-19 19:33:39'),
(231, 7, 39, 100, '2024-12-19 19:33:39'),
(232, 8, 39, 75, '2024-12-19 19:33:39'),
(233, 1, 40, 25, '2024-12-19 19:34:52'),
(234, 5, 40, 0, '2024-12-19 19:34:52'),
(235, 2, 40, 0, '2024-12-19 19:34:52'),
(236, 3, 40, 0, '2024-12-19 19:34:52'),
(237, 4, 40, 100, '2024-12-19 19:34:52'),
(238, 6, 40, 100, '2024-12-19 19:34:52'),
(239, 7, 40, 100, '2024-12-19 19:34:52'),
(240, 8, 40, 75, '2024-12-19 19:34:52'),
(241, 1, 41, 75, '2024-12-19 19:38:05'),
(242, 5, 41, 75, '2024-12-19 19:38:05'),
(243, 2, 41, 75, '2024-12-19 19:38:05'),
(244, 3, 41, 50, '2024-12-19 19:38:05'),
(245, 4, 41, 100, '2024-12-19 19:38:05'),
(246, 6, 41, 100, '2024-12-19 19:38:05'),
(247, 7, 41, 100, '2024-12-19 19:38:05'),
(248, 8, 41, 75, '2024-12-19 19:38:05'),
(249, 1, 42, 25, '2024-12-20 07:26:14'),
(250, 5, 42, 100, '2024-12-20 07:26:14'),
(251, 2, 42, 75, '2024-12-20 07:26:14'),
(252, 3, 42, 50, '2024-12-20 07:26:14'),
(253, 4, 42, 100, '2024-12-20 07:26:14'),
(254, 6, 42, 75, '2024-12-20 07:26:14'),
(255, 7, 42, 75, '2024-12-20 07:26:14'),
(256, 8, 42, 75, '2024-12-20 07:26:14'),
(257, 1, 43, 75, '2024-12-23 16:23:51'),
(258, 5, 43, 50, '2024-12-23 16:23:51'),
(259, 2, 43, 75, '2024-12-23 16:23:51'),
(260, 3, 43, 25, '2024-12-23 16:23:51'),
(261, 4, 43, 75, '2024-12-23 16:23:51'),
(262, 6, 43, 50, '2024-12-23 16:23:51'),
(263, 7, 43, 25, '2024-12-23 16:23:51'),
(264, 8, 43, 75, '2024-12-23 16:23:51'),
(265, 1, 44, 50, '2024-12-25 01:03:16'),
(266, 5, 44, 100, '2024-12-25 01:03:16'),
(267, 2, 44, 50, '2024-12-25 01:03:16'),
(268, 3, 44, 25, '2024-12-25 01:03:16'),
(269, 4, 44, 100, '2024-12-25 01:03:16'),
(270, 6, 44, 100, '2024-12-25 01:03:16'),
(271, 7, 44, 25, '2024-12-25 01:03:16'),
(272, 8, 44, 75, '2024-12-25 01:03:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `ix_answers_id` (`id`);

--
-- Indexes for table `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_assessments_id` (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `topic_id` (`topic_id`),
  ADD KEY `ix_questions_id` (`id`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `topic_id` (`topic_id`),
  ADD KEY `ix_resources_id` (`id`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `ix_topics_id` (`id`);

--
-- Indexes for table `topic_assessment_logs`
--
ALTER TABLE `topic_assessment_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `topic_id` (`topic_id`),
  ADD KEY `ix_topic_assessment_logs_id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=217;

--
-- AUTO_INCREMENT for table `assessments`
--
ALTER TABLE `assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `topic_assessment_logs`
--
ALTER TABLE `topic_assessment_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=273;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`);

--
-- Constraints for table `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`);

--
-- Constraints for table `topic_assessment_logs`
--
ALTER TABLE `topic_assessment_logs`
  ADD CONSTRAINT `topic_assessment_logs_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
