const Logger = require('../../logger.js');
const DataTypes = require('./types.js');
const DataConstraints = require('./relationships_constraints.js');
const Model = require('./model.js');

/**
 * In order to keep the models dynamic and flexible, we need to be able to add
 * new models to the database in whatever order the developer wants too. Without
 * them worrying about dependancies and such, we can just add them to the database
 * in the order they are defined. This class will handle that for us. As well as
 * keeping track of the models that have been added to the database.
 */


/**
 * @class Database
 * @classdesc The Database class is used to create a database instance.
 * @param {object} connection - An active instance of a psql database connection
 */
class PSQLObjectRelation {
    constructor(psqlConnection) {
        Logger.Database('ORM Loading...');
        this.connection = psqlConnection;;
        this.models = [];
        // dummyModels are for models that have requested a model that doesn't exist
        // the model that doesn't exist will be added here, and once it is added, the
        // dummy dependancy will be resolved
        this.dummyModels = [];
    }

    /**
     * @function model
     * @description Gets a model from the database stash
     * @param {string} modelName - The name of the target model
     */
    model(modelName) {
        // TODO: Resolve the dependancy if it dosen't exist and make a note of it
        if (!this.models[modelName]) { 
            Logger.Database(`Model ${modelName} does not exist, adding to dummyModels`);

            if (this.dummyModels[modelName]) {
                return this.dummyModels[modelName];
            }

            const dummy = new Model(modelName, {}, true);
            this.dummyModels[modelName] = dummy;
            return dummy;
        }
        return this.models[modelName];
    }

    /**
     * @function addModel
     * @description Adds a model to the database stash
     * @param {string} name 
     * @param {object} model
     */
    addModel(name, model) {
        Logger.Database(`ORM Adding ${name}`);

        if (this.models[name]) {
            Logger.Error(`Redefinition of model ${name}, ignoring.`);
            return;
        }

        const keys = Object.keys(model);

        /**
         * Make sure that every property has a type and a conatraints array
         * If not, add it
         * The structure should always look like:
         * property: {
         *   type: DataTypes.VARCHAR(50),
         *   constraints: [ DataConstraints.PRIMARY_KEY, DataConstraints.NOT_NULL ]
         * }
         */
        keys.forEach(key => {
            if (typeof model[key] != 'object') {
                const type = model[key];
                model[key] = {
                    type: type,
                    constraints: []
                };
            }
            if (!model[key].constraints) {
                model[key].constraints = [];
            }
        });

        this.models[name] = new Model(name, model);
    }

    /**
     * @function resolveDependants
     * @description Resolves all the dependancies for the models that have been added where properties weren't available when they were added
     */
    // TODO: Make this more maintainable
    resolveDepends() {
        for (const dummyModelName in this.dummyModels)
        {
            const dummyModel = this.dummyModels[dummyModelName];

            if (!this.models[dummyModel.name]) {
                Logger.Error(`Model ${dummyModel.name} does not exist, cannot resolve dependancies`);
                continue;
            }

            for (const propertyName in dummyModel.properties)
            {
                const property = dummyModel.properties[propertyName];

                if (property.type !== DataTypes.INHERET) {
                    continue;
                }

                if (property.referers.length === 0 || property.referers[0] === '') {
                    Logger.Error(`Model ${dummyModel.name} has a property ${propertyName} with no referers`);
                    continue;
                }

                for (const referer of property.referers) {
                    if (!this.models[referer]) {
                        Logger.Error(`Model ${dummyModel.name} has a property ${propertyName} with a referer ${referer} that does not exist`);
                        continue;
                    }
                    
                    // TODO: Make more generic
                    const relaventConstraints = this.models[referer].properties[dummyModelName].constraints;
                    for (const constraint in relaventConstraints) {
                        if (typeof relaventConstraints[constraint] === 'object') {
                            this.models[referer].properties[dummyModelName].constraints[constraint] = DataConstraints.FOREIGN_KEY_REF(dummyModel.name);
                            Logger.Database(`Model ${referer} has a property ${dummyModel.name} which was resolved to a foreign key`);
                            break;
                        }
                    }

                    this.dummyModels.splice(this.dummyModels.indexOf(dummyModel), 1);
                }
            }
        }
    }

    /**
     * @function syncModels
     * @description Syncs the models to the database
     * ONLY run this after all models are properly added
     */
    async syncModels() {
        Logger.Database('ORM Syncing...');
        this.resolveDepends();
        console.log(this.models['lego_brick']);
    }
}

module.exports = PSQLObjectRelation;
