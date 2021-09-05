import { SlotMachineCadence } from './SlotMachineCadence';

test.each([
  [{
    columnSize: 6,
    minToAnticipate: 1,
    maxToAnticipate: 2,
    anticipateCadence: 2,
    defaultCadence: 1,
  }, {
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
  }, {"roundOne": [0, 1, 3, 5, 7, 8], "roundTwo": [0, 2, 4, 5, 6, 7], "roundThree": [0, 1, 2, 4, 6, 7]}],
  [{
    columnSize: 5,
    minToAnticipate: 3,
    maxToAnticipate: 6,
    anticipateCadence: 4,
    defaultCadence: 2,
  }, {
    roundOne: {
      specialSymbols: [
        { column: 0, row: 0 },
        { column: 0, row: 1 },
        { column: 1, row: 3 },
        { column: 2, row: 3 },
        { column: 3, row: 0 },
        { column: 3, row: 1 },
      ],
    },
    roundTwo: {
      specialSymbols: [
        { column: 1, row: 0 },
        { column: 1, row: 1 },
        { column: 2, row: 3 },
        { column: 2, row: 4 },
        { column: 3, row: 0 },
        { column: 4, row: 1 },
      ],
    },
    roundThree: {
      specialSymbols: [
        { column: 2, row: 2 },
      ],
    },
  }, {"roundOne": [0, 2, 6, 10, 12], "roundTwo": [0, 2, 4, 8, 12], "roundThree": [0, 2, 4, 6, 8]}],
])

('when line is %j returns %j', (config, line, expected) => {
  SlotMachineCadence.setAnticipatorConfig(config);
  const received = SlotMachineCadence.handleCadences(SlotMachineCadence.createRoundsSymbols(line));
  expect(received).toEqual(expected);
});