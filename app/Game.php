<?php

namespace Mentosmenno2\MaartenBday2023;

use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
use Mentosmenno2\MaartenBday2023\Levels\LevelDuckPong;
use Mentosmenno2\MaartenBday2023\Levels\LevelDuckyDash;
use Mentosmenno2\MaartenBday2023\Levels\LevelQuackVSQuack;
use Mentosmenno2\MaartenBday2023\Levels\LevelQuickQueckQuack;
use Mentosmenno2\MaartenBday2023\Levels\LevelStart;
use Mentosmenno2\MaartenBday2023\Levels\LevelTagADuck;

class Game
{

	protected static ?Game $instance = null;

	/**
	 * @var array<int,AbstractLevel>
	 */
	protected array $levels;

	final protected function __construct()
	{
		$this->levels = array(
			new LevelStart(),
			new LevelDuckyDash(),
			new LevelDuckPong(),
			new LevelTagADuck(),
			new LevelQuickQueckQuack(),
			new LevelQuackVSQuack(),
		);
	}

	public static function getInstance(): Game
	{
		if (! static::$instance) {
			static::$instance = new static();
		}

		return static::$instance;
	}

	public function getLevel(): ?AbstractLevel
	{
		$levelParam = filter_input(INPUT_GET, 'level');
		if (empty($levelParam)) {
			return $this->levels[0];
		}

		foreach ($this->levels as $level) {
			if ($level->getId() === $levelParam) {
				return $level;
			}
		}

		return null;
	}

	public function getNextLevel(): AbstractLevel
	{
		$index = array_search($this->getLevel(), $this->levels, false);
		if ($index === false) {
			return $this->levels[0];
		}

		return $this->levels[$index + 1] ?? $this->levels[0];
	}

	/**
	 * @return array<string,string>
	 */
	public function getLevelSelectOptions(): array
	{
		$options = array();
		foreach ($this->levels as $level) {
			if ($level->getId() !== 'start') {
				$options[$level->getId()] = $level->getName();
			}
		}
		return $options;
	}

	public function getPlayers(): int
	{
		return (int) filter_input(INPUT_GET, 'players', FILTER_VALIDATE_INT);
	}
}
