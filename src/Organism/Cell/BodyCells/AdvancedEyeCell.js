const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");
const Directions = require("../../Directions");
const Observation = require("../../Perception/Observation")

class AdvancedEyeCell extends BodyCell {
    constructor(org, loc_col, loc_row) {
        super(CellStates.advancedeye, org, loc_col, loc_row);
        this.org.anatomy.has_eyes = true;
    }

    initInherit(parent) {
        // deep copy parent values
        super.initInherit(parent);
        this.direction = parent.direction;
    }

    initRandom() {
        // initialize values randomly
        this.direction = Directions.getRandomDirection();
    }

    initDefault() {
        // initialize to default values
        this.direction = Directions.up;
    }

    getAbsoluteDirection() {
        var dir = this.org.rotation + this.direction;
        if (dir > 3)
            dir -= 4;
        return dir;
    }

    performFunction() {
        let obses = this.look();
        this.org.brain.observe(obses[0]);
        this.org.brain.observe(obses[1]);
        this.org.brain.observe(obses[2]);
    }

    look() {
        var env = this.org.env;
        let obses = []
        for (let index = 0; index < 3; index++) {
            var direction = this.getAbsoluteDirection();
            if (index == 1) {
                direction = Directions.rotateRight(direction)
            }
            if (index == 2) {
                direction = Directions.rotateRight(direction)
                direction = Directions.rotateRight(direction)
                direction = Directions.rotateRight(direction)
            }
            var addCol = 0;
            var addRow = 0;
            switch (direction) {
                case Directions.up:
                    addRow = -1;
                    break;
                case Directions.down:
                    addRow = 1;
                    break;
                case Directions.right:
                    addCol = 1;
                    break;
                case Directions.left:
                    addCol = -1;
                    break;
            }
            var start_col = this.getRealCol();
            var start_row = this.getRealRow();
            var col = start_col;
            var row = start_row;
            var cell = null;
            var end = false;
            for (var i = 0; i < Hyperparams.lookRange; i++) {
                col += addCol;
                row += addRow;
                cell = env.grid_map.cellAt(col, row);
                if (cell == null) {
                    break;
                }
                if (cell.owner === this.org && Hyperparams.seeThroughSelf) {
                    continue;
                }
                if (cell.state !== CellStates.empty) {
                    var distance = Math.abs(start_col - col) + Math.abs(start_row - row);
                    obses.push(new Observation(cell, distance, direction));
                    end = true;
                }
            }
            if (!end) {
                obses.push(new Observation(cell, Hyperparams.lookRange, direction));
            }
        }
        return obses
    }
}

module.exports = AdvancedEyeCell;