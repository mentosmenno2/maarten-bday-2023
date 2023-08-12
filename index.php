<?php

// Define constants

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Templates;

define('MAARTEN_BDAY_2023_NAMESPACE', 'Mentosmenno2\\MaartenBday2023\\');
define('MAARTEN_BDAY_2023_ROOT_DIR', __DIR__);
define('MAARTEN_BDAY_2023_CLI', php_sapi_name() === 'cli');

// Autoload
require_once __DIR__ . '/autoloader.php';

$game = Game::getInstance();
$currentLevel = $game->getLevel();
$chat = $currentLevel ? $currentLevel->getChat() : null;
$nextLevel = $game->getNextLevel();
$characters = $game->getCharacters();

?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Maarten Bday 2023 - The Stolen Present</title>

		<link rel="icon" type="image/png" href="assets/images/favicon.png">

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
			<h1>Maarten Bday 2023 - The Stolen Present</h1>
		</header>
		<main
			class="game"
			data-next-level="<?php echo $nextLevel->getId(); ?>"
			data-level="<?php echo htmlspecialchars(json_encode($currentLevel?: '') ?: '', ENT_QUOTES); ?>"
			data-characters="<?php echo htmlspecialchars(json_encode($characters?: '') ?: '', ENT_QUOTES); ?>"
		>
			<?php if ($currentLevel) { ?>
				<?php ( new Templates() )->echoTemplate('instructions', array(
					'level' => $currentLevel,
					'game'  => $game,
				)); ?>

				<?php ( new Templates() )->echoTemplate('levels/' . $currentLevel->getId(), array(
					'level' => $currentLevel,
					'game'  => $game,
				)); ?>

				<?php ( new Templates() )->echoTemplate('results'); ?>
			<?php } else { ?>
				<div class="level">
					<p>Cheater!</p>
					<a class="button" href="?level=">Back to start</a>
				</div>
			<?php } ?>

			<?php if ($chat) { ?>
				<?php ( new Templates() )->echoTemplate('chat', array(
					'game' => $game,
				)); ?>
			<?php } ?>

			<?php ( new Templates() )->echoTemplate('loading'); ?>
		</main>
		<footer>
			<div class="volume-settings">
				<div>
					<label for="volume-music">Music volume: <span class="volume-value volume-audio-music-value"></span>%</label>
					<input type="range" min="0" max="100" value="0" class="slider slider-volume" id="volume-audio-music">
				</div>
				<div>
					<label for="volume-audio-effect">Effects volume: <span class="volume-value volume-audio-effect-value"></span>%</label>
					<input type="range" min="0" max="100" value="0" class="slider slider-volume" id="volume-audio-effect">
				</div>
			</div>
			<p class="copyright">&#169; Menno van den Ende - 2023</p>
		</footer>

		<audio class="audio audio-effect audio-effect-rubberduck-2" preload="auto">
			<source src="assets/audio/effects/rubberduck-2.mp3" type="audio/mpeg">
		</audio>
		<audio class="audio audio-effect audio-effect-rubberduck-1" preload="auto">
			<source src="assets/audio/effects/rubberduck-1.mp3" type="audio/mpeg">
		</audio>
		<audio class="audio audio-effect audio-effect-fail" preload="auto">
			<source src="assets/audio/effects/fail.mp3" type="audio/mpeg">
		</audio>
		<audio class="audio audio-effect audio-effect-button" preload="auto">
			<source src="assets/audio/effects/button.mp3" type="audio/mpeg">
		</audio>
		<audio class="audio audio-music audio-music-chat" preload="auto" loop>
			<source src="assets/audio/music/chat.mp3" type="audio/mpeg">
		</audio>
		<audio class="audio audio-music audio-music-ingame" preload="auto" loop>
			<source src="assets/audio/music/ingame.mp3" type="audio/mpeg">
		</audio>
		<audio class="audio audio-music audio-music-menu" preload="auto" loop>
			<source src="assets/audio/music/menu.mp3" type="audio/mpeg">
		</audio>


		<script src="assets/js/jquery-3.7.0.min.js"></script>
		<script src="assets/js/helpers.js"></script>
		<?php if ($currentLevel) { ?>
			<script src="assets/js/levels/<?php echo $currentLevel->getId(); ?>.js"></script>
		<?php } ?>
		<script src="assets/js/main.js"></script>
	</body>
</html>
