<?php
/**
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;

$players = $game->getPlayers();

?>

<div class="chat">
	<div class="textballoon__container" >
		<div class="textballoon textballoon-player" >

		</div>
		<div class="textballoon textballoon-enemy" >

		</div>
	</div>

	<div class="talker__container" >
		<div class="talker talker-player" >
			<img class="pixelated flipped-horizontal" alt="" src="assets/images/<?php echo isset($players[0]) ? $players[0]->getId() : 'maarten'; ?>-duck.png" >
		</div>
		<div class="talker talker-enemy" >
			<img class="pixelated" alt="" src="assets/images/<?php echo isset($players[1]) ? $players[1]->getId() : 'evil'; ?>-duck.png" >
		</div>
	</div>
</div>
