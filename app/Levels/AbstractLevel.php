<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use JsonSerializable;
use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;

abstract class AbstractLevel implements JsonSerializable
{
	abstract public function getId(): string;

	abstract public function getChat(): ?AbstractChat;

	public function jsonSerialize(): mixed
	{
		return array(
			'id' => $this->getId(),
			'chat' => $this->getChat(),
		);
	}
}
