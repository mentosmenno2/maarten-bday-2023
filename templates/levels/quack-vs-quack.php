<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;

$players = $game->getPlayers();
?>

<div class="level level-quack-vs-quack">
	<div class="healthbar-wrapper healthbar-wrapper-player">
		<div class="healthbar-progress healthbar-progress-player"></div>
		<span class="healthbar-text">
			<?php echo $players[0]->getName(); ?> health
		</span>
	</div>

	<div class="healthbar-wrapper healthbar-wrapper-enemy">
		<div class="healthbar-progress healthbar-progress-enemy"></div>
		<span class="healthbar-text">
			<?php echo isset($players[1]) ? $players[1]->getName() : 'Evil duck'; ?> health
		</span>
	</div>

	<div class="character character-enemy">
		<img class="pixelated" alt="" src="assets/images/<?php echo isset($players[1]) ? $players[1]->getId() : 'evil'; ?>-duck.png" >
	</div>

	<div class="character character-player">
		<img class="pixelated" alt="" src="assets/images/<?php echo $players[0]->getId(); ?>-duck.png" >
	</div>
</div>
