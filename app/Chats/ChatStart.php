<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatStart extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			// After start button
			new EnemyMessage('Every year you get a special present from Menno. Why do you get all the attention?'),
			new PlayerMessage('What are you doing here?'),
			new EnemyMessage('I\'m tired of being left out! For now, this present is mine!'),
			new EnemyMessage('I challenge you to a game. Beat me in all five minigames, and you\'ll get your precious present back.'),
			new PlayerMessage('Fine, I accept your challenge. Let\'s see what you\'ve got.'),

			// Before Minigame 1 - Ducky Dash
			new EnemyMessage('Prepare yourself. Our first challenge is Ducky Dash! I\'ll leave you in my wake.'),
			new PlayerMessage('We\'ll see about that.'),
		);
	}
}
