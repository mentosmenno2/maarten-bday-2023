<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;

class LevelWhackADuck extends AbstractLevel
{
	public function getId(): string
	{
		return 'whack-a-duck';
	}

	public function getName(): string
	{
		return 'Whack A Duck';
	}

	public function getInstructions(): string
	{
		return 'When the evil duck pops up, hit it before it dissapears again.';
	}

	public function getChat(): ?AbstractChat
	{
		return null;
	}
}
