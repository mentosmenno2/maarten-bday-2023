<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use JsonSerializable;
use Mentosmenno2\MaartenBday2023\Chats\Messages\AbstractMessage;

abstract class AbstractChat implements JsonSerializable
{

	/**
	 * @return array<AbstractMessage>
	 */
	abstract public function getMessages(): array;

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return array(
			'messages' => $this->getMessages(),
		);
	}
}
