<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;
use Mentosmenno2\MaartenBday2023\Chats\ChatDuckPong;

class LevelDuckPong extends AbstractLevel
{
	public function getId(): string
	{
		return 'duck-pong';
	}

	public function getName(): string
	{
		return 'Duck Pong';
	}

	public function getInstructions(): string
	{
		return 'Bounce the ball back to the other player. Move your mouse/finger to move your duck.';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatDuckPong();
	}
}
