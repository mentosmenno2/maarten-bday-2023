<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;

$players = $game->getPlayers();
?>

<div class="level level-duck-pong">
	<div class="score-wrapper score-wrapper-player">
		<span class="score-progress score-progress-player">0</span>
		/
		<span class="score-total score-total-player">5</span>
	</div>

	<div class="score-wrapper score-wrapper-enemy">
		<span class="score-progress score-progress-enemy">0</span>
		/
		<span class="score-total score-total-enemy">5</span>
	</div>

	<hr class="devider" />

	<span class="countdown" >3</span>

	<div class="character character-enemy">
		<?php for ($i=0; $i < 3; $i++) { ?>
			<img class="pixelated" alt="" src="assets/images/<?php echo isset($players[1]) ? $players[1]->getId() : 'evil'; ?>-duck.png" >
		<?php } ?>
	</div>

	<div class="character character-player">
		<?php for ($i=0; $i < 3; $i++) { ?>
			<img class="pixelated" alt="" src="assets/images/<?php echo isset($players[0]) ? $players[0]->getId() : 'maarten'; ?>-duck.png" >
		<?php } ?>
	</div>

	<div class="ball"></div>
</div>
