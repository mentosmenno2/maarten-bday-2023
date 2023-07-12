<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;
use Mentosmenno2\MaartenBday2023\Chats\ChatWhackADuck;

class LevelTagADuck extends AbstractLevel
{
	public function getId(): string
	{
		return 'tag-a-duck';
	}

	public function getName(): string
	{
		return 'Tag A Duck';
	}

	public function getInstructions(): string
	{
		return 'When the evil duck pops up, tag it before it dissapears again.';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatWhackADuck();
	}
}
