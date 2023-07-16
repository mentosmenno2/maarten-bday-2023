<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;
use Mentosmenno2\MaartenBday2023\Chats\ChatQuackVsQuack;

class LevelQuackVSQuack extends AbstractLevel
{
	public function getId(): string
	{
		return 'quack-vs-quack';
	}

	public function getName(): string
	{
		return 'Quack V.S. Quack';
	}

	public function getInstructions(): string
	{
		return 'Dodge evil duck bullets. Hit the evil duck with your bullets. Move your mouse/finger to move your duck. Bullets shoot automatically.';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatQuackVsQuack();
	}
}
