"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../../dist");
/**
 * Base Model
 */
class Model extends dist_1.Model {
}
Model.Collection = 'Collection';
Model.schema = {
    created: {
        type: 'Timestamp',
        options: {
            type: 'insert'
        }
    },
    id: 'Id',
    updated: {
        type: 'Timestamp',
        options: {
            type: 'update'
        }
    }
};
exports.default = Model;
