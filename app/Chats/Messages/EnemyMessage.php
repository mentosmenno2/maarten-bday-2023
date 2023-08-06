<?php

namespace Mentosmenno2\MaartenBday2023\Chats\Messages;

use Mentosmenno2\MaartenBday2023\Game;

class EnemyMessage extends AbstractMessage
{
	public function __construct(string $message)
	{
		$players = Game::getInstance()->getPlayers();
		$playerName = isset($players[1]) ? $players[1]->getName() : 'Evil duck';
		parent::__construct($playerName . ': ' . $message);
		$this->talker = 'enemy';
	}
}
