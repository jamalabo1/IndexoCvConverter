const i18n = require('i18n');

module.exports = {
    helpers: {
        i18n: function () {
            return i18n.__.apply(this, arguments);
        },
        math: function (lvalue, operator, rvalue, options) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);

            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        },
        concat: function (lvalue, rvalue) {
            return (lvalue + "." + rvalue).toLowerCase();
        },
        isSkillAvailable: function (isAvailable) {
            return isAvailable === true ? 'checked' : ''
        }
    }
};
