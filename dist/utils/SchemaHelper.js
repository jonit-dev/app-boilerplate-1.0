"use strict";
const validator = require("validator");
/**
 * addCommonFields: Add common fields to the schema, to avoid having to add them manually every time
 * @return updated schema
 */
const addCommonFields = (schema, commonFields, addCommonPatterns = false, addCommonTypePatterns = false) => {
    //set some attributes to be always added when a particular TYPE is found
    const commonTypePatterns = [
        {
            type: String,
            attr: {
                trim: true
            }
        },
        {
            type: Number,
            attr: {
                default: 0,
                validate(value) {
                    if (value < 0) {
                        throw new Error("Field must be a positive number");
                    }
                }
            }
        }
    ];
    //set some attributes to always be added when a particular field is set on schema
    const commonPatterns = [
        {
            fields: ["name", "title"],
            attr: {
                trim: true,
                required: true
            }
        },
        {
            fields: ["description"],
            attr: {
                trim: true
            }
        },
        {
            fields: ["password"],
            attr: {
                trim: true,
                required: true,
                minlength: 7
            }
        },
        {
            fields: ["email"],
            attr: {
                lowercase: true,
                trim: true,
                validate(value) {
                    if (!validator.isEmail(value)) {
                        throw new Error("Email is invalid!");
                    }
                }
            }
        }
    ];
    const kvSchema = Object.entries(schema).map(([key, value]) => ({
        key,
        value
    }));
    schema = {};
    kvSchema.forEach(attr => {
        const { key, value } = attr;
        schema[key] = value;
        schema[key] = Object.assign(Object.assign({}, value), commonFields);
        if (addCommonPatterns) {
            commonPatterns.forEach(cp => {
                if (cp.fields.includes(key)) {
                    schema[key] = Object.assign(Object.assign({}, schema[key]), cp.attr);
                }
            });
        }
        if (addCommonTypePatterns) {
            commonTypePatterns.forEach(ctp => {
                if (ctp.type === schema[key].type) {
                    schema[key] = Object.assign(Object.assign({}, schema[key]), ctp.attr);
                }
            });
        }
    });
    return schema;
};
module.exports = {
    addCommonFields
};
