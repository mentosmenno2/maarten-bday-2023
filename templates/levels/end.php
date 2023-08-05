<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;

?>

<div class="level level-end">
	<div class="credit-container">
		<div class="credit-item">
			<h2 class="credit-title"></h2>
			<p class="credit-text"></p>
		</div>

		<button class="button button-main-menu">Main menu</button>
	</div>

	<button class="button button-skip-credits">Skip</button>
</div>

<audio class="audio audio-music audio-music-credits" preload="auto" loop>
	<source src="assets/audio/music/credits.mp3" type="audio/mpeg">
</audio>
