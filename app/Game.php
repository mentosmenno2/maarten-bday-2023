<?php

namespace Mentosmenno2\MaartenBday2023;

use Mentosmenno2\MaartenBday2023\Characters\AbstractCharacter;
use Mentosmenno2\MaartenBday2023\Characters\CharacterAnnemarie;
use Mentosmenno2\MaartenBday2023\Characters\CharacterBatman;
use Mentosmenno2\MaartenBday2023\Characters\CharacterDanielle;
use Mentosmenno2\MaartenBday2023\Characters\CharacterDavina;
use Mentosmenno2\MaartenBday2023\Characters\CharacterHulk;
use Mentosmenno2\MaartenBday2023\Characters\CharacterJelle;
use Mentosmenno2\MaartenBday2023\Characters\CharacterMaarten;
use Mentosmenno2\MaartenBday2023\Characters\CharacterMenno;
use Mentosmenno2\MaartenBday2023\Characters\CharacterNinjaTurtle;
use Mentosmenno2\MaartenBday2023\Characters\CharacterSonic;
use Mentosmenno2\MaartenBday2023\Characters\CharacterSpiderman;
use Mentosmenno2\MaartenBday2023\Characters\CharacterTom;
use Mentosmenno2\MaartenBday2023\Characters\CharacterWaldo;
use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
use Mentosmenno2\MaartenBday2023\Levels\LevelDuckPong;
use Mentosmenno2\MaartenBday2023\Levels\LevelDuckyDash;
use Mentosmenno2\MaartenBday2023\Levels\LevelEnd;
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

	/**
	 * @var array<int,AbstractCharacter>
	 */
	protected array $characters;

	final protected function __construct()
	{
		$this->levels = array(
			new LevelStart(),
			new LevelDuckyDash(),
			new LevelDuckPong(),
			new LevelTagADuck(),
			new LevelQuickQueckQuack(),
			new LevelQuackVSQuack(),
			new LevelEnd(),
		);

		$this->characters = array(
			new CharacterMaarten(),
			new CharacterMenno(),
			new CharacterAnnemarie(),
			new CharacterDanielle(),
			new CharacterDavina(),
			new CharacterJelle(),
			new CharacterTom(),
			new CharacterBatman(),
			new CharacterHulk(),
			new CharacterNinjaTurtle(),
			new CharacterSonic(),
			new CharacterSpiderman(),
			new CharacterWaldo(),
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
			if ($level->getId() !== 'start' && $level->getId() !== 'end') {
				$options[$level->getId()] = $level->getName();
			}
		}
		return $options;
	}

	/**
	 * @return array<string,AbstractCharacter>
	 */
	public function getCharacterSelectOptions(): array
	{
		$options = array();
		foreach ($this->characters as $character) {
			$options[$character->getId()] = $character;
		}
		return $options;
	}

	/**
	 * @return array<AbstractCharacter>
	 */
	public function getPlayers(): array
	{
		$characters = array();
		$url_characters = filter_input(INPUT_GET, 'players', FILTER_DEFAULT, FILTER_FORCE_ARRAY) ?: array();
		foreach ($this->characters as $character) {
			foreach ($url_characters as $url_character) {
				if ($character->getId() === $url_character) {
					$characters[] = $character;
				}
			}
		}

		if (empty($characters)) {
			$characters[] = $this->characters[0];
		}

		return $characters;
	}

	/**
	 * @return array<string,AbstractCharacter>
	 */
	public function getCharacters(): array
	{
		return array_combine(
			array_map(function (AbstractCharacter $character): string {
				return $character->getId();
			}, $this->characters),
			$this->characters
		);
	}
}
