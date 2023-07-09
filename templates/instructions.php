<?php

/**
 * @var AbstractLevel $level
 */

use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;

$instructions = $level->getInstructions();
?>

<div class="instructions" >
	<h2><?php echo $level->getName(); ?></h2>
	<?php if ($instructions) { ?>
		<div>
			<p><?php echo $level->getInstructions(); ?></p>
		</div>
	<?php } ?>
	<button class="button button-start">Start</button>
</div>
