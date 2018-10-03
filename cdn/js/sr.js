jQuery(document).ready(function($)
{
	//set url to production
	var serverurl = "http://srcryptoapi.eu-west-1.elasticbeanstalk.com/";
	//check if we are local
	//note : set this whatever your local instance is 127.0.0.1 for example
	if(window.location.href.indexOf("srcryptowww") > -1) 
	{
		serverurl = "http://127.0.0.1:3000/";
	}
	//alert(serverurl);
	//set the address
	var address = '';
	//init price var
	var productPrice = 0;
	var cartWrapper = $('.cd-cart-container');
	//set the cart wrapper
	var productCustomization = $('.cd-customization'),
	//set the cart
	cart = $('.cd-cart'),
	//set animating boolean
	animating = false;

	//call the server to get a btc address
	$.get( serverurl+"api/address", function( data ) 
	{
		//get the data
	  	data = jQuery.parseJSON( data );
	  	//console.log(data.address);
	  	address = data.address;
	  	//set the address
	  	$('#bitcoinaddress').text(address);
	  	//set the href of the bitcoin address
	  	$('#bitcoinaddress').attr('href','bitcoin:'+address);
	  	//generate the qr code
	  	$('#bitcoinqrcode').attr('src','https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl='+address);
	  	//init the product
	});

	initCustomization(productCustomization);

	//check we have a cart
	if( cartWrapper.length > 0 ) 
	{
		//store jQuery objects for later use
		var cartBody = cartWrapper.find('.body')
		var cartList = cartBody.find('ul').eq(0);
		var cartTotal = cartWrapper.find('.checkout').find('span');
		//console.log(cartTotal);
		var cartTrigger = cartWrapper.children('.cd-cart-trigger');
		var cartCount = cartTrigger.children('.count')
		var addToCartBtn = $('.sr-add-to-cart');
		var bitcoinback = cartWrapper.find('.bitcoinback');
		
		//add product to cart
		addToCartBtn.on('click', function(event){
			event.preventDefault();
			addToCart($(this));
		});

		//open/close cart
		cartTrigger.on('click', function(event){
			event.preventDefault();
			toggleCart();
		});

		//close cart when clicking on the .cd-cart-container::before (bg layer)
		cartWrapper.on('click', function(event){
			if( $(event.target).is($(this)) ) toggleCart(true);
		});

		//delete an item from the cart
		cartList.on('click', '.delete-item', function(event){
			event.preventDefault();
			//remove the product
			removeProduct($(event.target).parents('.product'));
		});

		//load btc address for payment
		cartWrapper.on('click', '.checkout', function(event){
			event.preventDefault();
			bitcoinback.addClass('visible');
			///$('#bitcoin-address-template').show();
			$('#bitcoinaddresswrapper').show();
			//hide the cart items
			$('#cartlistitems').hide();
		});

		
		//copy the btc address to the clipboard
		cartWrapper.on('click', '.bitcoinaddresscopy', function(event){
			event.preventDefault();
			/* Get the text field */
  			var element = document.getElementById("bitcoinaddress");
  			var $temp = $("<input>");
  			$("body").append($temp);
  			$temp.val($(element).text()).select();
 		 	document.execCommand("copy");
  			//$temp.remove();


		});

		//back button is clicked so show items
		cartWrapper.on('click', '#checkoutbitocoin', function(event){
			event.preventDefault();
			bitcoinback.removeClass('visible');
			$('#bitcoinaddresswrapper').hide();
			//$('#bitcoin-address-template').hide();
			$('#cartlistitems').show();
		});

	}

	function initCustomization(items) 
	{
		items.each(function()
		{
			var actual = $(this),
				selectOptions = actual.find('[data-type="select"]'),
				addToCartBtn = actual.find('.sr-add-to-cart'),
				touchSettings = actual.next('.cd-customization-trigger');

			//detect click on ul.size/ul.color list elements 
			selectOptions.on('click', function(event) { 
				var selected = $(this);
				//open/close options list
				selected.toggleClass('is-open');
				resetCustomization(selected);
				
				if($(event.target).is('li')) {
					// update selected option
					var activeItem = $(event.target),
						index = activeItem.index() + 1;
					
					activeItem.addClass('active').siblings().removeClass('active');
					selected.removeClass('selected-1 selected-2 selected-3').addClass('selected-'+index);
					// if color has been changed, update the visible product image 
					selected.hasClass('sr-color') && updateSlider(selected, index-1);
				}
			});

			//detect click on the add-to-cart button
			addToCartBtn.on('click', function() {	
				if(!animating) {
					//animate if not already animating
					animating =  true;
					resetCustomization(addToCartBtn);

					addToCartBtn.addClass('is-added').find('path').eq(0).animate({
						//draw the check icon
						'stroke-dashoffset':0
					}, 300, function(){
						setTimeout(function(){
							//updateCart();
							addToCartBtn.removeClass('is-added').find('em').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
								//wait for the end of the transition to reset the check icon
								addToCartBtn.find('path').eq(0).css('stroke-dashoffset', '19.79');
								animating =  false;
							});

							if( $('.no-csstransitions').length > 0 ) {
								// check if browser doesn't support css transitions
								addToCartBtn.find('path').eq(0).css('stroke-dashoffset', '19.79');
								animating =  false;
							}
						}, 600);
					});	
				}
			});

			//detect click on the settings icon - touch devices only
			touchSettings.on('click', function(event){
				event.preventDefault();
				resetCustomization(addToCartBtn);
			});
		});
	}


	/*
		This function deals with showing or hiding the cart.
	*/
	function toggleCart(bool) 
	{
		//always hide the address regardless of the toggle state as we never want to show this unless the 
		//checkout button has been clicked
		$('#bitcoinaddresswrapper').hide();
		//check if the cart is open or not
		var cartIsOpen = ( typeof bool === 'undefined' ) ? cartWrapper.hasClass('cart-open') : bool;
		
		
		if( cartIsOpen ) {
			cartWrapper.removeClass('cart-open');
			bitcoinback.removeClass('visible');
			cartList.find('.deleted').remove();
			bitcoinback.removeClass('visible');
			$('#bitcoin-address-template').hide();
			$('#cartlistitems').show();

			setTimeout(function(){
				cartBody.scrollTop(0);
				//check if cart empty to hide it
				if( Number(cartCount.find('li').eq(0).text()) == 0) cartWrapper.addClass('empty');
			}, 500);
		} else {
			cartWrapper.addClass('cart-open');
		}
	}

	function addToCart(trigger) {
		var cartIsEmpty = cartWrapper.hasClass('empty');
		//update cart product list
		addProduct(trigger.data('price'),trigger.data('name'),trigger.data('id'));
		//update number of items 
		updateCartCount(cartIsEmpty);
		//update total price
		updateCartTotal(trigger.data('price'), true);
		//show cart
		cartWrapper.removeClass('empty');
	}

	function addProduct(price,name,productId) 
	{
		//get the product quantity
		prodcutquantity= $('#productquantity').val();
		//check if its set or not if not then set it 
		if (prodcutquantity == undefined)
			prodcutquantity = 0;
		//increment it by 1
		prodcutquantity++;
		//empty  the car contents
		cartList.empty();
		//build the row html
		//main product div
		var prodcuthtml = '';
		var prodcuthtml = prodcuthtml +'<li class="product">';
		//product image
		var prodcuthtml = prodcuthtml +'<div class="product-image"><a href="#0"><img src="img/product-preview.png" alt="placeholder"></a></div>';
		//product details div
		var prodcuthtml = prodcuthtml + '<div class="product-details">';
		//product name
		var prodcuthtml = prodcuthtml + '<h3><a href="#0">'+name+'</a></h3>';
		//product price
		var prodcuthtml = prodcuthtml + '<span class="productprice">$'+price+'</span>';
		//delete option
		var prodcuthtml = prodcuthtml + '<a href="#0" class="delete-item">Delete</a>';
		//actions div
		var prodcuthtml = prodcuthtml + '<div class="actions">';
		//quantity label
		var prodcuthtml = prodcuthtml + '<label for="cd-product-'+ productId +'">Qty</label>';
		//quantity select
		var prodcuthtml = prodcuthtml + '<span class="select"><select id="productquantity" name="productquantity">';
		var i = 0;
		for (i = 1; i < 11; i++) 
		{ 
			if (i == prodcutquantity)
				var prodcuthtml = prodcuthtml +'<option value="'+i+'" selected>'+i+'</option>';

			else
				var prodcuthtml = prodcuthtml +'<option value="'+i+'">'+i+'</option>';
		}
		//end of actions div
		var prodcuthtml = prodcuthtml + '</div>';
		//end of products details div
		var prodcuthtml = prodcuthtml + '</div>';
		//end of product div
		var prodcuthtml = prodcuthtml + '</div>';
		//end of li
		var prodcuthtml = prodcuthtml + '</li>';
		//add it
		//console.log(prodcuthtml);
		cartList.prepend(prodcuthtml);
		//updateCart()
	}

	//remove the product
	function removeProduct(product) 
	{		
		var topPosition = product.offset().top - cartBody.children('ul').offset().top ,
		productTotPrice = productPrice;
		product.css('top', topPosition+'px').addClass('deleted');
		cartTotal.text(0);
		productQuantity = 0;
		updateCartCount(true, 0);
	}

	//update the counter
	function updateCartCount(emptyCart, quantity) 
	{
		//check if cart is empty
		if ((emptyCart == true) && (quantity == 0))
		{
			var actual = 0
			var next = 1
			cartCount.find('li').eq(0).text(actual);
			cartCount.find('li').eq(1).text(next);

		}
		else
		{
			//check if it is the first time the cart is launched
			if( typeof quantity === 'undefined' ) 
			{
				var actual = Number(cartCount.find('li').eq(0).text()) + 1;
				var next = actual + 1;
				
				if( emptyCart ) {
					cartCount.find('li').eq(0).text(actual);
					cartCount.find('li').eq(1).text(next);
				} else {
					cartCount.addClass('update-count');

					setTimeout(function() {
						cartCount.find('li').eq(0).text(actual);
					}, 150);

					setTimeout(function() {
						cartCount.removeClass('update-count');
					}, 200);

					setTimeout(function() {
						cartCount.find('li').eq(1).text(next);
					}, 230);
				}
			} 
			else 
			{
				var actual = Number(cartCount.find('li').eq(0).text()) + quantity;
				var next = actual + 1;
				
				cartCount.find('li').eq(0).text(actual);
				cartCount.find('li').eq(1).text(next);
			}
		}
	}

	function updateCartTotal(price, bool) 
	{
		//console.log(cartTotal);
		bool ? cartTotal.text( (Number(cartTotal.text()) + Number(price)).toFixed(2) )  : cartTotal.text( (Number(cartTotal.text()) - Number(price)).toFixed(2) );
		//cartTotal.text( (Number(cartTotal.text()) + Number(price)).toFixed(2);
		//cartTotal.text( (Number(cartTotal.text()) - Number(price)).toFixed(2) );
	}

	function updateSlider(actual, index) 
	{
		var slider = actual.parent('.cd-customization').prev('a').children('.cd-slider-wrapper'),
			slides = slider.children('li');
		slides.eq(index).removeClass('move-left').addClass('selected').prevAll().removeClass('selected').addClass('move-left').end().nextAll().removeClass('selected move-left');
	}

	function resetCustomization(selectOptions) 
	{
		//close ul.clor/ul.size if they were left open and user is not interacting with them anymore
		//remove the .hover class from items if user is interacting with a different one
		selectOptions.siblings('[data-type="select"]').removeClass('is-open').end().parents('.cd-single-item').addClass('hover').parent('li').siblings('li').find('.cd-single-item').removeClass('hover').end().find('[data-type="select"]').removeClass('is-open');
	}

	
});

