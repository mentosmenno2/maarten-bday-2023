<?php

namespace Mentosmenno2\MaartenBday2023\Chats\Messages;

use JsonSerializable;

class AbstractMessage implements JsonSerializable
{

	protected string $talker;
	protected string $message;

	public function __construct(string $message)
	{
		$this->message = $message;
	}

	public function jsonSerialize(): mixed
	{
		return array(
			'talker' => $this->talker,
			'message' => $this->message,
		);
	}
}
