<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;
use Mentosmenno2\MaartenBday2023\Chats\ChatTagADuck;

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

	public function getControlsMouseMove(): string
	{
		return 'Move duck in any direction towards mouse cursor position.';
	}

	public function getControlsKeysArrows(): string
	{
		return 'Move duck in any direction.';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatTagADuck();
	}
}
