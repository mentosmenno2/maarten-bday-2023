<?php
/**
 * @var Game $game
 * @var AbstractLevel $level
 */

use Mentosmenno2\MaartenBday2023\Game;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;

$control_mouse_move = $level->getControlsMouseMove();
$control_mouse_click = $level->getControlsMouseClick();
$control_keys_arrows = $level->getControlsKeysArrows();
$control_keys_space = $level->getControlsKeysSpace();
?>

<div class="controls" >
	<?php if ($control_mouse_move || $control_mouse_click) { ?>
		<?php if ($game->getPlayers() > 1) { ?>
			<h3>Controls player 1</h3>
		<?php } else { ?>
			<h3>Controls</h3>
		<?php } ?>

		<ul>
			<?php if ($control_mouse_move) { ?>
				<li>
					<u>Move mouse cursor</u>:
					<span><?php echo $control_mouse_move; ?></span>
				</li>
			<?php } ?>
			<?php if ($control_mouse_click) { ?>
				<li>
					<u>Click</u>:
					<span><?php echo $control_mouse_click; ?></span>
				</li>
			<?php } ?>
		</ul>
	<?php } ?>

	<?php if ($control_keys_arrows || $control_keys_space) { ?>
		<?php if ($game->getPlayers() > 1) { ?>
			<h3>Controls player 2</h3>

			<ul>
				<?php if ($control_keys_arrows) { ?>
					<li>
						<u>Arrow / WASD keys</u>:
						<span><?php echo $control_keys_arrows; ?></span>
					</li>
				<?php } ?>
				<?php if ($control_keys_space) { ?>
					<li>
						<u>Space / return</u>:
						<span><?php echo $control_keys_space; ?></span>
					</li>
				<?php } ?>
			</ul>
		<?php } ?>
	<?php } ?>
</div>
