<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;

$players = $game->getPlayers();
?>

<div class="level level-tag-a-duck">
	<div class="progressbars-container">
		<div class="progressbar-wrapper progressbar-wrapper-1">
			<div class="progressbar-progress progressbar-progress-1"></div>
			<span class="progressbar-text progressbar-text-1">
				<?php echo isset($players[0]) ? $players[0]->getName() : 'Maarten'; ?>'s tags
			</span>
		</div>

		<div class="progressbar-wrapper progressbar-wrapper-2">
			<div class="progressbar-progress progressbar-progress-2"></div>
			<span class="progressbar-text progressbar-text-2">
				<?php echo isset($players[1]) ? $players[1]->getName() : 'Evil duck'; ?>'s tags
			</span>
		</div>
	</div>

	<div class="character character-player character-player-1">
		<img class="pixelated" alt="" src="assets/images/<?php echo isset($players[0]) ? $players[0]->getId() : 'maarten'; ?>-duck.png" >
	</div>

	<div class="character character-player character-player-2">
		<img class="pixelated" alt="" src="assets/images/<?php echo isset($players[1]) ? $players[1]->getId() : 'empty'; ?>-duck.png" >
	</div>

	<div class="character character-enemy">
		<img class="pixelated" alt="" src="assets/images/evil-duck.png" >
	</div>
</div>
