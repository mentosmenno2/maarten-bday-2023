<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
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
		<img class="pixelated" alt="" src="assets/images/evil-duck.png" >
		<img class="pixelated" alt="" src="assets/images/evil-duck.png" >
		<img class="pixelated" alt="" src="assets/images/evil-duck.png" >
	</div>

	<div class="character character-player">
		<img class="pixelated" alt="" src="assets/images/maarten-duck.png" >
		<img class="pixelated" alt="" src="assets/images/maarten-duck.png" >
		<img class="pixelated" alt="" src="assets/images/maarten-duck.png" >
	</div>

	<div class="ball"></div>
</div>
