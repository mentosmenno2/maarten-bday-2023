<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
?>

<div class="level level-quack-vs-quack">
	<div class="healthbar-wrapper healthbar-wrapper-player">
		<div class="healthbar-progress healthbar-progress-player"></div>
		<span class="healthbar-text">
			<?php if ($game->getPlayers() > 1) { ?>
				Player 1 health
			<?php } else { ?>
				Your health
			<?php } ?>
		</span>
	</div>

	<div class="healthbar-wrapper healthbar-wrapper-enemy">
		<div class="healthbar-progress healthbar-progress-enemy"></div>
		<span class="healthbar-text">
			<?php if ($game->getPlayers() > 1) { ?>
				Player 2 health
			<?php } else { ?>
				Evil duck health
			<?php } ?>
		</span>
	</div>

	<div class="character character-enemy">
		<img class="pixelated" alt="" src="assets/images/evil-duck.png" >
	</div>

	<div class="character character-player">
		<img class="pixelated" alt="" src="assets/images/maarten-duck.png" >
	</div>
</div>
