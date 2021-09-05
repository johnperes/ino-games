type AnticipatorConfig = {
  columnSize: number;
  minToAnticipate: number;
  maxToAnticipate: number;
  anticipateCadence: number;
  defaultCadence: number;
};
type SlotCoordinate = {
  column: number;
  row: number;
};
type SpecialSymbol = { specialSymbols: Array<SlotCoordinate> };
type RoundsSymbols = {
  roundOne: SpecialSymbol;
  roundTwo: SpecialSymbol;
  roundThree: SpecialSymbol;
};
type SlotCadence = Array<number>;
type RoundsCadences = {
  roundOne: SlotCadence;
  roundTwo: SlotCadence;
  roundThree: SlotCadence;
};

class SlotMachineCadenceClass {

  /**
   * This must be used to get all game rounds cadences.
   */
  slotMachineCadences: RoundsCadences = { roundOne: [], roundTwo: [], roundThree: [] };

  /**
   * The current anticipator configuration, used to calculate the cadence
   */
  anticipatorConfig: AnticipatorConfig;

  /**
   * The default round symbols
   */
  defaultRoundSymbols: RoundsSymbols;

  /**
   * To know if the number of symbols already surpassed the minimum number to do a anticipation in the current round
   */
  hasAnticipated: boolean = false;

  /**
   * How many sysbols where already found in the current round
   */
  currentFoundSymbols: number = 0;

  /**
   * Initializes the anticipator config and default round symbols
   */
  constructor() {

    /**
     * Anticipator configuration. Has all information needed to check anticipator.
     * @param columnSize It's the number of columns the slot machine has.
     * @param minToAnticipate It's the minimum number of symbols to start anticipation.
     * @param maxToAnticipate It's the maximum number of symbols to end anticipation.
     * @param anticipateCadence It's the cadence value when has anticipation.
     * @param defaultCadence It's the cadence value when don't has anticipation.
     */
    this.anticipatorConfig = {
      columnSize: 6,
      minToAnticipate: 1,
      maxToAnticipate: 2,
      anticipateCadence: 2,
      defaultCadence: 1,
    };

    /**
     * Game rounds with special symbols position that must be used to generate the SlotCadences.
     */
    this.defaultRoundSymbols = {
      roundOne: {
        specialSymbols: [
          { column: 1, row: 2 },
          { column: 4, row: 3 },
        ],
      },
      roundTwo: {
        specialSymbols: [
          { column: 0, row: 2 },
          { column: 2, row: 3 },
        ],
      },
      roundThree: {
        specialSymbols: [
          { column: 2, row: 2 },
          { column: 4, row: 3 },
        ],
      },
    };
  }

  /**
   * Update the anticipator config
   */
  setAnticipatorConfig(object: any) : void {
    this.anticipatorConfig.columnSize = object.columnSize;
    this.anticipatorConfig.minToAnticipate = object.minToAnticipate;
    this.anticipatorConfig.maxToAnticipate = object.maxToAnticipate;
    this.anticipatorConfig.anticipateCadence = object.anticipateCadence;
    this.anticipatorConfig.defaultCadence = object.defaultCadence;
  }

  /**
   * Convert a object to the type RoundsSymbols
   */
  createRoundsSymbols(object: any) : RoundsSymbols {
    const result: RoundsSymbols = {
      roundOne: object.roundOne,
      roundTwo: object.roundTwo,
      roundThree: object.roundThree,
    };
    return result;
  }

  /**
   * Get the number of symbols a column have
   * @param currentColumn The current column number.
   * @param symbols The array that contains all the symbols.
   */
  getSymbolsCount(currentColumn: number, symbols: Array<SlotCoordinate>): any {
    var initialValue = 0;
    return symbols.reduce((accumulator, item) => {
      return (currentColumn === item.column) ? accumulator + 1 : accumulator;
    }, initialValue);
  }

  /**
   * Get the current cadence of a certain column, also it checks the symbols and checks if we have to anticipate in
   * the next column
   * @param currentColumn The current column number.
   * @param currentCadence The last calculated cadence, from the last column.
   * @param symbols The array that contains all the symbols.
   */
  getCadence(currentColumn: number, currentCadence: number, symbols: Array<SlotCoordinate>): any {
    if (currentCadence === null) {
      currentCadence = 0;
    } else {
      if (this.hasAnticipated) {
        currentCadence += this.anticipatorConfig.anticipateCadence;
      } else {
        currentCadence += this.anticipatorConfig.defaultCadence;
      }
    }
    this.currentFoundSymbols += this.getSymbolsCount(currentColumn, symbols);
    if (this.currentFoundSymbols >= this.anticipatorConfig.minToAnticipate) {
      this.hasAnticipated = true;
    }
    if (this.currentFoundSymbols >= this.anticipatorConfig.maxToAnticipate) {
      this.hasAnticipated = false;
    }
    return currentCadence;
  }

  /**
   * This function receives an array of coordinates relative to positions in the slot machine's matrix.
   * This array is the positions of the special symbols.
   * And it has to return a slot machine stop cadence.
   * @param symbols Array<SlotCoordinate> positions of the special symbols. Example: [{ column: 0, row: 2 }, { column: 2, row: 3 }]
   * @returns SlotCadence Array of numbers representing the slot machine stop cadence.
   */
  slotCadence(symbols: Array<SlotCoordinate>): SlotCadence {
    this.hasAnticipated = false;
    this.currentFoundSymbols = 0;
    const result = [];
    let currentCadence = null;
    for (let index = 0; index < this.anticipatorConfig.columnSize; index++) {
      currentCadence = this.getCadence(index, currentCadence, symbols);
      result.push(currentCadence);
    }
    return result;
  }

  /**
   * Get all game rounds and return the final cadences of each.
   * @param rounds RoundsSymbols with contains all rounds special symbols positions.
   * @return RoundsCadences has all cadences for each game round.
   */
  handleCadences(rounds: RoundsSymbols): RoundsCadences {
    this.slotMachineCadences.roundOne = this.slotCadence(rounds.roundOne.specialSymbols);
    this.slotMachineCadences.roundTwo = this.slotCadence(rounds.roundTwo.specialSymbols);
    this.slotMachineCadences.roundThree = this.slotCadence(rounds.roundThree.specialSymbols);
    return this.slotMachineCadences;
  }
}

export const SlotMachineCadence = new SlotMachineCadenceClass();