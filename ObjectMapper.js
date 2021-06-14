/**
 * JavaScript Port of ObjectMapper by skitsanos
 * @param source {Object} source object
 * @param target {Object} target object
 * @returns {Object} resulting object
 */

const ObjectMapper = (source, target) =>
{
    const result = {};
    const applyFromTarget = (key) =>
    {
        return Object.prototype.hasOwnProperty.call(target, key) ? target[key] : source[key];
    };

    for (let _i = 0, _a = Object.keys(source); _i < _a.length; _i++)
    {
        const key = _a[_i];
        const currentItem = source[key];
        if (typeof currentItem === 'object' && !Array.isArray(currentItem))
        {
            const children = Object.keys(currentItem);
            if (children.length === 0)
            {
                result[key] = applyFromTarget(key);
            }
            else
            {
                result[key] = ObjectMapper(currentItem, applyFromTarget(key));
            }
        }
        else
        {
            result[key] = applyFromTarget(key);
        }
    }

    const newKeys = Object.keys(target).filter(function (el)
    {
        return Object.keys(source).indexOf(el) < 0;
    });

    for (var _b = 0, newKeys_1 = newKeys; _b < newKeys_1.length; _b++)
    {
        var newKey = newKeys_1[_b];
        result[newKey] = target[newKey];
    }
    return result;
};


module.exports = ObjectMapper;