<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;
use Mentosmenno2\MaartenBday2023\Chats\ChatQuickQueckQuack;

class LevelQuickQueckQuack extends AbstractLevel
{
	public function getId(): string
	{
		return 'quick-queck-quack';
	}

	public function getName(): string
	{
		return 'Quick Queck Quack';
	}

	public function getInstructions(): string
	{
		return 'When it\'s your turn, place a duck. Get three in a row to in the game.';
	}

	public function getControlsMouseClick(): string
	{
		return 'Click on a square to place a duck.';
	}

	public function getControlsKeysArrows(): string
	{
		return 'Select square.';
	}

	public function getControlsKeysSpace(): string
	{
		return 'Place a duck in selected square.';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatQuickQueckQuack();
	}
}
