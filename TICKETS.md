# QA has submitted the following tickets

## Filtering Orders
### QA Notes
When getting all orders filtered by a property, the orders are not being filtered at all. I tried filtering the orders by name for any order that was an "Additional Topping" but I'm getting all orders back.

### Tips
For query params you will want to assume `filterProperty` is "name" and `filterValue` is "Additional Topping".

### Dev Notes / Response
In endpoint to filter by filterProperty and filterValue, the .filter() method needs to evaluate to true or false. This is done in the inner call on the orders, but was not being done on the outer call, which should return true if there are items present after filtering the order items on the filtered property.

---


## Placing An Order
### QA Notes
When testing an order for a family of 6, the total is not as expected. I placed an order for the following: 

    - 2 Cheeseburgers
    - 2 Pickle Toppings
    - 1 Large Fiesta Salad
    - 3 Avocado Toppings
    - 1 Medium Hawaiian Pizza
    - 3 Medium French Fries
    - 4 Large Fountain Drinks

I calculated that the total should be $74.23 but I'm getting $51.28. Because that's a difference of $22.95, I have a feeling the "Medium Hawaiian Pizza" isn't being added.

### Tips
All items ordered (and more) can be referenced in lib/orders.js

### Dev Notes / Response
Issue was not because of missing hawaiian pizza, just a coincidence. When calculating total price, the method was not taking into account the quantity of each item in the order. 


---


## Updating An Order
### QA Notes
When getting updating an order I expect to only have to pass what has changed. However, if I don't pass everything (customerName or items), that value gets removed. If for instance I did not change the customer name, I would expect it to use the one originally on the order.

Additionally, when updating the items ordered, the total is not updating.

### Dev Notes / Response
Updated the update order endpoint to only update a value if it is is passed. Otherwise, the code will not change the value. Updated code to recalculate the price if the items changed.

Also made a small refactor to standardize the total price calculation, since it is used multiple times between endpoints.

Assumed that the user should not be able to change the id or create date

---


## Deleting An Order
### QA Notes
When  I delete an order, the order that gets deleted is never the one I expect. I know we recently changed how we are doing our deletes so I'm not sure everything got updated. But when I delete a specific order, that's usually not the one that gets deleted. Unless I delete it immediately.

### Dev Notes / Response
I would ask QA how they had it working in the first place! When hitting the endpoint, there was an error in the code: 

    ReferenceError: latest is not defined at ordersData.filter (/Users/evanashba/workspace/Back-End-Test/routes/orders.js:95:60)

I fixed this error by changing that variable to reference the order that is found by id. Now, it simply 'deletes' the order with the matching id.

I would follow up with QA and the manager though to confirm if this is the expected logic, or if it is supposed to work differently, since there seemed to be some confusion regarding a change.


---


## Other
Also updated the PUT and DELETE endpoints to actually update ordersData object, so the state changse are persisted while the server is still running. Not necessarily a bug considering it is a mockup app but I thought it would be cool!