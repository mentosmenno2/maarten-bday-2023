<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
?>

<div class="level level-tag-a-duck">
	<div class="progressbars-container">
		<div class="progressbar-wrapper progressbar-wrapper-1">
			<div class="progressbar-progress progressbar-progress-1"></div>
			<span class="progressbar-text progressbar-text-1">
				<?php if (count($game->getPlayers()) > 1) { ?>
					Player 1
				<?php } ?>
				Tags
			</span>
		</div>

		<div class="progressbar-wrapper progressbar-wrapper-2">
			<div class="progressbar-progress progressbar-progress-2"></div>
			<span class="progressbar-text progressbar-text-2">
				Player 2 Tags
			</span>
		</div>
	</div>

	<div class="character character-player character-player-1">
		<img class="pixelated" alt="" src="assets/images/maarten-duck.png" >
	</div>

	<div class="character character-player character-player-2">
		<img class="pixelated" alt="" src="assets/images/duck.png" >
	</div>

	<div class="character character-enemy">
		<img class="pixelated" alt="" src="assets/images/evil-duck.png" >
	</div>
</div>
