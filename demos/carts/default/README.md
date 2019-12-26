This is the default cart. 

All the core code is containd in cart.html and cart.css.

There are various demos showing the cart in all it's iterations

1-cart-customer-address-server.html

This demo shows the ECS cart with the a billing address connecting the ECS server.  It will collect the customers email and shipping address and store them in the servers database.

2-cart-customer-address-no-server.html

This demo shows the ECS cart with the a billing address connecting the ECS server.  It will collect the customers email and shipping address but as there is no server it will not store them.  This is simply a demo a develoer can use to skin the cart without having to run a server.

3-cart-no-customer-adress-server.html

This demo shows the ECS cart with the a billing address connecting the ECS server.  It will collect the customers email address and store it in the servers database.

4-cart-donation-server.html

This demo shows the ECS cart in donation mode. It will use the server to generate the address

5-cart-donation-no-server.html

This demo shows the ECS cart in donation mode. It will use the address passed to it from the init function.  This method does not require a full node or a server so it is very cheap to run.

6-cart-lightning-server.html


This demo shows the ECS cart with lightning mode enabled. Note Lightning requires a server so there is not a no server option for this set up.



other urls

All of the demos are set up to use local but you can also point to testnet or mainnet by chaning the URLS below. 


Produciton 

<script type="text/javascript" src="https://cryptoskillz.com/srcrypto/prod/cdn/js/sr.js"></script>
SR.init(["https://ecslive.cryptoskillz.com/",15,"https://cryptoskillz.com/srcrypto/prod/demos/carts/default/","3",1,"GB",0,"",0]);



testnet 

Note: there is no need for a testnet sr.js so either point it to production (to use the latest) or local to test the code you are working on.

SR.init(["https://ecstest.cryptoskillz.com/",15,"https://cryptoskillz.com/srcrypto/prod/demos/carts/default/","3",1,"GB",0,"",0]);





