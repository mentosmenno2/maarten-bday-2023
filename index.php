<?php

// Define constants

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Templates;

define('MAARTEN_BDAY_2023_NAMESPACE', 'Mentosmenno2\\MaartenBday2023\\');
define('MAARTEN_BDAY_2023_ROOT_DIR', __DIR__);
define('MAARTEN_BDAY_2023_CLI', php_sapi_name() === 'cli');

// Autoload
require_once __DIR__ . '/autoloader.php';

$game = new Game();
$currentLevel = $game->getLevel();
$chat = $currentLevel ? $currentLevel->getChat() : null;
$nextLevel = $game->getNextLevel();

?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>The stolen present</title>

		<link rel="preload" href="assets/fonts/VT323/VT323-Regular.woff" as="font" type="font/woff" crossorigin>
		<link rel="preload" href="assets/fonts/VT323/VT323-Regular.woff2" as="font" type="font/woff2" crossorigin>
		<link rel="stylesheet" href="assets/fonts/VT323/stylesheet.css" />

		<link rel="stylesheet" href="assets/css/main.css" />

		<?php if ($currentLevel) { ?>
			<link rel="stylesheet" href="assets/css/<?php echo $currentLevel->getId(); ?>.css" />
		<?php } ?>
	</head>
	<body>
		<header>
			<h1>Maarten Bday 2023 - The stolen present</h1>
		</header>
		<main
			class="game"
			data-next-level="<?php echo $nextLevel->getId(); ?>"
			data-level="<?php echo htmlspecialchars(json_encode($currentLevel?: '') ?: '', ENT_QUOTES); ?>"
		>
			<?php if ($currentLevel) { ?>
				<?php ( new Templates() )->echoTemplate('levels/' . $currentLevel->getId()); ?>
			<?php } else { ?>
				<div class="level">
					<p>Cheater!</p>
					<a class="button" href="?level=">Back to start</a>
				</div>
			<?php } ?>

			<?php if ($chat) { ?>
				<?php ( new Templates() )->echoTemplate('chat'); ?>
			<?php } ?>
		</main>
		<footer>
			<p>&#169; Menno van den Ende - 2023</p>
		</footer>

		<script src="assets/js/jquery-3.7.0.min.js"></script>
		<?php if ($currentLevel) { ?>
			<script src="assets/js/<?php echo $currentLevel->getId(); ?>.js"></script>
		<?php } ?>
		<script src="assets/js/main.js"></script>
	</body>
</html>
