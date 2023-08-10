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
		<h2>Select a gamemode</h2>
		<div class="setting-choices setting-minigame-choices" >
			<button class="button button-sfx button-setting-mode" data-mode="story" >Story mode</button>
			<button class="button button-sfx button-setting-mode" data-mode="minigame" >Minigames</button>
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
		<h2>How many players?</h2>
		<div class="setting-choices setting-minigame-choices" >
			<button class="button button-sfx button-setting-players" data-players="1" >1 player</button>
			<button class="button button-sfx button-setting-players" data-players="2" >2 players (requires keyboard)</button>
		</div>
	</div>

	<div class="setting-container setting-container-characters">
		<h2>
			<span class="setting-characters-title-player"></span>
			Choose your character
		</h2>
		<div class="setting-choices setting-character-choices" >
			<?php foreach ($game->getCharacterSelectOptions() as $character) { ?>
				<button class="button button-sfx button-setting-characters" data-character="<?php echo $character->getId(); ?>" >
					<div class="button-character-icon">
						<img class="pixelated" alt="" src="assets/images/<?php echo $character->getId(); ?>-duck.png" >
					</div>
					<span class="button-character-text"><?php echo $character->getName(); ?></span>
				</button>
			<?php } ?>
		</div>
	</div>

	<div class="setting-container setting-container-confirm-ready">
		<div class="setting-container-background-images">
			<div class="setting-container-background-image">
				<img class="pixelated flipped-horizontal" alt="" data-src="assets/images/CHARACTER_ID-duck.png" src="" >
			</div>
			<div class="setting-container-background-image">
				<img class="pixelated" alt="" data-src="assets/images/CHARACTER_ID-duck.png" src="" >
			</div>
		</div>

		<div class="setting-container-front">
			<h2>Are you ready?</h2>

			<ul class="setting-confirm-ready-selection"></ul>

			<div class="setting-choices setting-confirm-ready-choices" >
				<button class="button button-sfx button-setting-confirm-ready">Ready!</button>
			</div>
		</div>
	</div>

	<button class="button button-sfx button-setting-back">Back</button>
</div>

<audio class="audio audio-voice audio-voice-characters" preload="auto">
	<source src="assets/audio/voices/characters.mp3" type="audio/mpeg">
</audio>
<audio class="audio audio-voice audio-voice-gamemode" preload="auto">
	<source src="assets/audio/voices/gamemode.mp3" type="audio/mpeg">
</audio>
<audio class="audio audio-voice audio-voice-minigame" preload="auto">
	<source src="assets/audio/voices/minigame.mp3" type="audio/mpeg">
</audio>
<audio class="audio audio-voice audio-voice-players" preload="auto">
	<source src="assets/audio/voices/players.mp3" type="audio/mpeg">
</audio>
<audio class="audio audio-voice audio-voice-ready" preload="auto">
	<source src="assets/audio/voices/ready.mp3" type="audio/mpeg">
</audio>
