<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;

$players = $game->getPlayers();
?>

<div class="level level-ducky-dash">

	<div class="finish"></div>

	<div class="character character-player">
		<img class="pixelated" alt="" src="assets/images/<?php echo $players[0]->getId(); ?>-duck.png" >
	</div>
	<div class="character character-enemy">
		<img class="pixelated" alt="" src="assets/images/<?php echo isset($players[1]) ? $players[1]->getId() : 'evil'; ?>-duck.png" >
	</div>

	<?php for ($i=0; $i < 10; $i++) { ?>
		<div class="obstacle"></div>
	<?php } ?>
</div>
