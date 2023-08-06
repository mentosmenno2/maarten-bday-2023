<?php

namespace Mentosmenno2\MaartenBday2023\Chats\Messages;

use Mentosmenno2\MaartenBday2023\Game;

class PlayerMessage extends AbstractMessage
{
	public function __construct(string $message)
	{
		$playerName = Game::getInstance()->getPlayers()[0]->getName();
		parent::__construct($playerName . ': ' . $message);
		$this->talker = 'player';
	}
}
