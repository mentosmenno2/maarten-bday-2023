<?php

/**
 * @var string $text
 */

?>

<div class="instructions" >
	<?php if ($text) { ?>
		<h2>Instructions</h2>
		<div>
			<p><?php echo $text; ?></p>
		</div>
	<?php } ?>
	<button class="button button-start">Start</button>
</div>
