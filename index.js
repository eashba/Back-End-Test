const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const cors = require('koa2-cors');

const app = new Koa()

const ordersRouter = require('./routes/orders');

app.use(cors({ allowMethods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'] }))
    .use(bodyparser({ enableTypes: ['json'] }))
    .use(ordersRouter.routes())

const server = app.listen(5555, () => {
    console.log(`API running on 5555`); // eslint-disable-line no-console
});

module.exports = server;