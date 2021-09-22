const Router = require('koa-router');
const uuid = require('uuid').v4;

const ordersRouter = new Router({ prefix: '/orders' });
const ordersData = require('../lib/orders');

const getTotal = (items) => {
    return items.reduce((orderTotal, item) => orderTotal += (item.price * item.quantity), 0)
}

ordersRouter.post('/', async ctx => {
    const { customerName, items } = ctx.request.body;

    if (!items.length) {
        ctx.throw(409, 'No items ordered')
    }
    
    const total = getTotal(items)
    const order = {
        id: uuid(),
        customerName,
        createdOn: new Date(),
        items,
        total
    }

    ctx.status = 201;
    ordersData.push(order)
    ctx.body = ordersData;
});

ordersRouter.get('/', async ctx => {
    const { filterProperty, filterValue } = ctx.query;

    let results = ordersData;

    if (filterProperty && filterValue) {
        const filteredResults = ordersData.filter(({ items }) => 
            items.filter(item => item[filterProperty].includes(filterValue)).length > 0
        )
        results = filteredResults;
    }

    ctx.status = 200;
    ctx.body = results;
});

ordersRouter.get('/:id', async ctx => {
    const { id } = ctx.params;
    const order = ordersData.find(order => order.id === id)

    if (!order) {
        ctx.throw(404, 'Order not found')
    }

    ctx.status = 200;
    ctx.body = order;
});

ordersRouter.put('/:id', async ctx => {
    const { id } = ctx.params;
    const { customerName, items } = ctx.request.body;

    const order = ordersData.find(order => order.id === id);

    if(!order) {
        ctx.throw(404, 'Could not find order');
    }

    if(customerName) {
        order.customerName = customerName;
    }

    if(items) {
        order.items = items;
        order.price = getTotal(order.items)
    }

    const updated = {
        ...order,
    }

    ctx.status = 200;
    ctx.body = updated;
});

ordersRouter.delete('/:id', async ctx => {
    const { id } = ctx.params;

    const orderIndexToDelete = ordersData.findIndex(order => order.id === id);

    if(orderIndexToDelete === -1) {
        ctx.throw(404, 'Could not find order');
    }

    ordersData.splice(orderIndexToDelete, 1)

    ctx.status = 200;
    ctx.body = ordersData;
});

module.exports = ordersRouter;
