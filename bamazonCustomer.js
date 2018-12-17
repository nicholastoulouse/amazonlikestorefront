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
    //promptUser(res);
    connection.end();
  });
}

// Created a series of questions
function promptCustomer(productList) {

inquirer.prompt([

    {
      type: "input",
      name: "product_id",
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

    var SKU = order.product_id;
    var qnty = order.units;
    var fulfilled = order.placeOrder;

    var query = "SELECT product_name, stock_quantity FROM products WHERE ?";
    connection.query(query, { product_id: SKU }, function(err, res) {
    console.log(res);
    if (fulfilled) { // If the user guesses the password...
  
      console.log("==============================================");
      console.log("");
      //console.log("Well a deal's a deal " + user.name);
      console.log("You can stay as long as you like.");
      //console.log("Just put down the " + user.carryingWhat.join(" and ") + ". It's kind of freaking me out.");
      console.log("");
      console.log("==============================================");
    }
  
    // If the user doesn't guess the password...
    else {
  
      console.log("==============================================");
      console.log("");
      console.log("We're sorry to see you canceled your order for " + qnty + " of " + SKU + ".");
      console.log("I'm calling the cops!");
      console.log("");
      console.log("==============================================");
  
    }
  });   
  });
}