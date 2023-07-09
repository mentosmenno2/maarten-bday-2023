<?php
/**
 * @var AbstractLevel $level
 */

use Mentosmenno2\MaartenBday2023\Templates;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
?>

<div class="level level-ducky-dash">

	<div class="finish"></div>

	<div class="character character-player">
		<img class="pixelated" alt="" src="assets/images/maarten-duck.png" >
	</div>
	<div class="character character-enemy">
		<img class="pixelated" alt="" src="assets/images/evil-duck.png" >
	</div>

	<?php for ($i=0; $i < 10; $i++) { ?>
		<div class="obstacle"></div>
	<?php } ?>
</div>
