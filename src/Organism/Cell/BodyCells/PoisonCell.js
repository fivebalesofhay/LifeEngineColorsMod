const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

class PoisonCell extends BodyCell {
    constructor(org, loc_col, loc_row) {
        super(CellStates.poison, org, loc_col, loc_row);
    }

    performFunction() {
        var env = this.org.env;
        var c = this.getRealCol();
        var r = this.getRealRow();
        for (var loc of Hyperparams.killableNeighbors) {
            var cell = env.grid_map.cellAt(c + loc[0], r + loc[1]);
            this.killNeighbor(cell);
        }
    }

    killNeighbor(n_cell) {
        if (n_cell == null || n_cell.owner == null || n_cell.owner == this.org || !n_cell.owner.living || n_cell.state == CellStates.armor)
            return;
        if (n_cell.state != CellStates.mouth && n_cell.state != CellStates.killer) return;
        var is_hit = n_cell.state == CellStates.killer; // has to be calculated before death
        n_cell.owner.harm();
        n_cell.owner.harm();
        if (Hyperparams.instaKill && is_hit) {
            this.org.harm();
        }
    }
}

module.exports = PoisonCell;
