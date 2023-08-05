<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
?>

<div class="level level-quick-queck-quack">
	<div class="turn-text turn-text-player">Your turn</div>
	<div class="turn-text turn-text-enemy">Evil duck's turn</div>
	<div class="buttons-container">
		<?php for ($i=0; $i < 9; $i++) { ?>
			<button class="button button-spot" data-spot="<?php echo $i + 1; ?>"></button>
		<?php } ?>
	</div>

	<div class="character character-player clonable">
		<img class="pixelated" alt="" src="assets/images/maarten-duck.png" >
	</div>
	<div class="character character-enemy clonable">
		<img class="pixelated" alt="" src="assets/images/evil-duck.png" >
	</div>
</div>
