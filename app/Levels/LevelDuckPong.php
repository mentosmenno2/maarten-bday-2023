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
		return 'Use your ducks to bounce the ball back to the other side of the field. Don\'t let the enemy score on your side.';
	}

	public function getControlsMouseMove(): string
	{
		return 'Move ducks left or right towards mouse cursor position.';
	}

	public function getControlsKeysArrows(): string
	{
		return 'Move ducks left or right.';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatDuckPong();
	}
}
