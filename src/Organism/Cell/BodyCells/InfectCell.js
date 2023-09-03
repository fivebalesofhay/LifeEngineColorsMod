const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

class InfectCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.infect, org, loc_col, loc_row);
    }

    performFunction() {
        var env = this.org.env;
        var c = this.getRealCol();
        var r = this.getRealRow();
        for (var loc of Hyperparams.killableNeighbors) {
            var cell = env.grid_map.cellAt(c+loc[0], r+loc[1]);
            this.infectNeighbor(cell);
        }
    }

    infectNeighbor(n_cell) {
        if(n_cell == null || n_cell.owner == null || n_cell.owner == this.org || !n_cell.owner.living || n_cell.state == CellStates.armor) 
            return;
        n_cell.owner.infector = this.org;
    }
}

module.exports = InfectCell;
