const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

class CarnivoreMouthCell extends BodyCell {
    constructor(org, loc_col, loc_row) {
        super(CellStates.carnivoremouth, org, loc_col, loc_row);
    }

    performFunction() {
        var env = this.org.env;
        var real_c = this.getRealCol();
        var real_r = this.getRealRow();
        for (var loc of Hyperparams.edibleNeighbors) {
            var cell = env.grid_map.cellAt(real_c + loc[0], real_r + loc[1]);
            this.eatNeighbor(cell, env);
            this.killNeighbor(cell);
        }
    }

    eatNeighbor(n_cell, env) {
        if (n_cell == null || !this.org.anatomy.is_mover)
            return;
        if (n_cell.state == CellStates.food) {
            env.changeCell(n_cell.col, n_cell.row, CellStates.empty, null);
            this.org.food_collected++;
        }
    }

    killNeighbor(n_cell) {
        if (n_cell == null || n_cell.owner == null || n_cell.owner == this.org || !n_cell.owner.living || n_cell.state == CellStates.armor)
            return;
        if ((n_cell.owner.anatomy.is_producer && !n_cell.owner.anatomy.is_mover) || !this.org.anatomy.is_mover) return;
        var is_hit = n_cell.state == CellStates.killer; // has to be calculated before death
        n_cell.owner.harm();
        if (Hyperparams.instaKill && is_hit) {
            this.org.harm();
        }
    }
}

module.exports = CarnivoreMouthCell;
