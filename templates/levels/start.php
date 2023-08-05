<?php
/**
 * @var AbstractLevel $level
 * @var Game $game
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;

?>

<div class="level level-start">
	<div class="setting-container setting-container-mode">
		<h2>What do you want to play?</h2>
		<div class="setting-choices setting-minigame-choices" >
			<button class="button button-sfx button-setting-mode" data-mode="story" >Story mode</button>
			<button class="button button-sfx button-setting-mode" data-mode="minigame" >Minigame</button>
		</div>
	</div>

	<div class="setting-container setting-container-minigame">
		<h2>Select a minigame</h2>
		<div class="setting-choices setting-minigame-choices" >
			<?php foreach ($game->getLevelSelectOptions() as $id => $label) { ?>
				<button class="button button-sfx button-setting-minigame" data-level="<?php echo $id; ?>"><?php echo $label; ?></button>
			<?php } ?>
		</div>
	</div>

	<div class="setting-container setting-container-players">
		<h2>With how many players do you want to play?</h2>
		<div class="setting-choices setting-minigame-choices" >
			<button class="button button-sfx button-setting-players" data-players="1" >1 player</button>
			<button class="button button-sfx button-setting-players" data-players="2" >2 players (requires keyboard)</button>
		</div>
	</div>
</div>
