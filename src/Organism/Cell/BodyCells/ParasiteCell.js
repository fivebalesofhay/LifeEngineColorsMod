const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

class ParasiteCell extends BodyCell {
    constructor(org, loc_col, loc_row) {
        super(CellStates.parasite, org, loc_col, loc_row);
    }

    performFunction() {
        var env = this.org.env;
        var c = this.getRealCol();
        var r = this.getRealRow();
        for (var loc of Hyperparams.killableNeighbors) {
            var cell = env.grid_map.cellAt(c + loc[0], r + loc[1]);
            this.parasitizeNeighbor(cell);
        }
    }

    parasitizeNeighbor(n_cell) {
        
        if (n_cell == null || n_cell.owner == null || n_cell.owner == this.org || !n_cell.owner.living || n_cell.state == CellStates.armor
            || n_cell.owner.food_collected < 1) return;

        if (Math.random() > 0.5) return; // Failure chance (50%)

        n_cell.owner.parasitize();
        this.org.food_collected++;
    }
}

module.exports = ParasiteCell;
