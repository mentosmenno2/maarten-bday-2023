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
		return 'Tic Tac Toe, but with a twist.';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatQuickQueckQuack();
	}
}
