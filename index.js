/**
 * US GAAP Chart of Accounts Parser
 * @version 1.0.0
 * @author skitsanos, http://github.com/skitsanos
 */

const {parse} = require('@fast-csv/parse');
const fs = require('fs');
const ObjectMapper = require('./ObjectMapper');

const objectPath = require('object-path');

const csvContent = fs.readFileSync('./2021-us-gaap-coa-basic.csv');

const doc = [];

const createPath = (obj, path, value = null) =>
{
    path = typeof path === 'string' ? path.split('.') : path;
    let current = obj;
    while (path.length > 1)
    {
        const [head, ...tail] = path;
        path = tail;
        if (current[head] === undefined)
        {
            current[head] = {};
        }
        current = current[head];
    }
    current[path[0]] = value;
    return obj;
};

const parseItems = data =>
{
    let res = {};

    for (const el of data)//.filter(item => item.id.split('.').length === 1))
    {
        const obj = createPath({}, el.id, el);
        res = {...ObjectMapper(res, obj)};
    }

    return res;
};

const stream = parse({headers: true})
    .on('error', error => console.error(error))
    .on('data', row =>
    {
        doc.push({
            id: row['Account #'],
            title: row['Account Title'],
            balance: row['Balance']
        });
    })
    .on('end', rowCount =>
    {
        console.log(`Parsed ${rowCount} rows`);
        console.log(`Formatting ... \n${'〰'.repeat(80)}`);

        const ledger = parseItems(doc);

        console.log(JSON.stringify(ledger));

        console.log(`${'〰'.repeat(80)}\n\nSelecting account`);
        console.log(objectPath.get(ledger, '6.3'));
    });

stream.write(csvContent);
stream.end();