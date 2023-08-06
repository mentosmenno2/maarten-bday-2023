<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;

$players = $game->getPlayers();
?>

<div class="level level-quick-queck-quack">
	<div class="turn-text turn-text-none">
		Turn indicator
	</div>
	<div class="turn-text turn-text-player">
		<?php echo isset($players[0]) ? $players[0]->getName() : 'Maarten'; ?>'s turn
	</div>

	<div class="turn-text turn-text-enemy">
		<?php echo isset($players[1]) ? $players[1]->getName() : 'Evil duck'; ?>'s turn
	</div>

	<div class="buttons-container">
		<?php for ($i=0; $i < 9; $i++) { ?>
			<button class="button button-spot" data-spot="<?php echo $i + 1; ?>"></button>
		<?php } ?>
	</div>

	<div class="character character-player clonable">
		<img class="pixelated" alt="" src="assets/images/<?php echo isset($players[0]) ? $players[0]->getId() : 'maarten'; ?>-duck.png" >
	</div>
	<div class="character character-enemy clonable">
		<img class="pixelated" alt="" src="assets/images/<?php echo isset($players[1]) ? $players[1]->getId() : 'evil'; ?>-duck.png" >
	</div>
</div>
