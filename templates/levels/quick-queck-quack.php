<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
?>

<div class="level level-quick-queck-quack">
	<div class="turn-text"><span class="turn-indicator">Your</span> turn</div>
	<div class="buttons-container">
		<?php for ($i=0; $i < 9; $i++) { ?>
			<button class="button button-spot" data-spot="<?php echo $i + 1; ?>"></button>
		<?php } ?>
	</div>
</div>
