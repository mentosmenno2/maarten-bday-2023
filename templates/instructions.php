<?php

/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
use Mentosmenno2\MaartenBday2023\Templates;

$instructions = $level->getInstructions();
?>

<div class="instructions" >
	<div class="instructions-text-container">
		<h2><?php echo $level->getName(); ?></h2>
		<?php if ($instructions) { ?>
			<div class="instructions-text">
				<p><?php echo $level->getInstructions(); ?></p>
			</div>
		<?php } ?>

		<?php ( new Templates() )->echoTemplate('controls', array(
			'game'  => $game,
			'level' => $level,
		)); ?>
	</div>

	<button class="button button-sfx button-start">Start</button>
</div>
