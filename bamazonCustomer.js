var inquirer = require("inquirer");
var mysql = require("mysql");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: "root",
    password: "helloMySQL",
    database: "bamazon",
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  promptCustomer();
});

function productInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}

function promptCustomer() {

inquirer.prompt([

    // {
    //   type: "list",
    //   name: "menu",
    //   choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    // },
    {
      type: "input",
      name: "item_id",
      message: "What is the ID of the product you wish to buy?"
    },
    {
        type: "input",
        name: "units",
        message: "How many would you like to buy at this time?"
    },
  
    {
      type: "confirm",
      name: "placeOrder",
      message: "Are you ready to place your order?"
    }
  
  ]).then(function(order) {

    var SKU = order.item_id;
    var qnty = parseInt(order.units);
    console.log("Quantity sought is ", qnty);

    var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
    connection.query(query, { item_id: SKU }, function(err, [res]) {

      if (err) throw err;
      var productName = res.product_name;
      var newInventoryCount = parseInt(res.stock_quantity) - qnty;
      var invoice = parseFloat(res.price) * qnty;

      if (order.placeOrder && newInventoryCount < 0) {
        console.log("==============================================");
        console.log("");
        console.log("Insufficient quantity!");
        console.log("");
        console.log("==============================================");
        return;

      } else if (order.placeOrder && newInventoryCount > 0){
        
        var query = "UPDATE products SET stock_quantity=" + newInventoryCount + " WHERE item_id=" + SKU;
        connection.query(query, function(err, updtd) {
          if (err) throw err;
          console.log("updated products table ", updtd);
          console.log("==============================================");
          console.log("");
          console.log("The total cost for " + qnty + " of " + productName + " with SKU of " + SKU + " is "+ invoice + ".");
          console.log("Your order has been placed.");
          console.log("");
          console.log("==============================================");
          return;
        });
      }
  });   
  });
}