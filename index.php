<?php

// Define constants
define('MAARTEN_BDAY_2023_NAMESPACE', 'Mentosmenno2\\MaartenBday2023\\');
define('MAARTEN_BDAY_2023_ROOT_DIR', __DIR__);
define('MAARTEN_BDAY_2023_CLI', php_sapi_name() === 'cli');

// Autoload
require_once __DIR__ . '/autoloader.php';

$game = new \Mentosmenno2\MaartenBday2023\Game();
$currentLevel = $game->getLevel();
$nextLevel = $game->getNextLevel();

?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>The Great Duck Escape</title>
		<link href="//fonts.googleapis.com/css?family=Source+Code+Pro:300&subset=latin,latin-ext" rel="stylesheet" type="text/css">
		<link rel="stylesheet" href="assets/css/main.css" />

		<?php if ($currentLevel) { ?>
			<link rel="stylesheet" href="assets/css/<?php echo $currentLevel->getId(); ?>.css" />
		<?php } ?>
	</head>
	<body>
		<header>
			<h1>Maarten Bday 2023 - The Great Duck Escape</h1>
		</header>
		<main data-next-level="<?php echo $nextLevel->getId(); ?>">
			<?php new \Mentosmenno2\MaartenBday2023\Game(); ?>
		</main>
		<footer>
			<p>&#169; Menno van den Ende - 2023</p>
		</footer>

		<script src="assets/js/jquery-3.7.0.min.js"></script>
		<script src="assets/js/main.js"></script>
		<?php if ($currentLevel) { ?>
			<script src="assets/js/<?php echo $currentLevel->getId(); ?>.js"></script>
		<?php } ?>
	</body>
</html>
