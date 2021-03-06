/* global Vue */
/* global notie */
/* global $ */

var productDrop = Vue.component("productdrop", {
  template: "#productDrop",
  props: ["senderid"],
  data: function() {
    return {
      products: [],
      currentDescription: "select...",
      currentSender: this.senderid,
    }
  },
  created: function() {
     var url = "/api/products";
      this.$http.get(url).then(response => {
      this.products = response.body;
    }, response => {
    // error callback
    notie.alert('error', response.statusText, 1.5);
    });
  },
  methods: {
    updateSender: function(product) {
      this.currentDescription = product.name;
      // TODO: POST/PUT changes to productbuttons
      var url = "/api/productbuttons";
      var data = {
        productid: product.id,
        senderid: this.currentSender
      }
      this.$http.post(url, data).then(response => {
        notie.alert("success", "succesfully updated sender " + this.currentSender, 1.5);
    }, response => {
    // error callback
    notie.alert('error', response.statusText, 1.5);
    });
    }
  }
})
var senders = Vue.component("senders", {
  template: "#senders",
  data: function() {
    return {
      senders: [],
      productbuttons: []
    }
  },
   created: function() {
      var url = "/api/sender";
      this.$http.get(url).then(response => {
      this.senders = response.body;
    }, response => {
    // error callback
    notie.alert('error', response.statusText, 1.5);
    });
     /*var url = "/api/productbuttons";
      this.$http.get(url).then(response => {
      this.productbuttons = response.body;
    }, response => {
    // error callback
    notie.alert('error', response.statusText, 1.5);
    });*/
}
});

var product = Vue.component("product", {
  template: "#product",
  data: function() {
    return {
      product: new Product()
    };
  },
  methods: {
    saveProduct: function() {
      var url = "/api/products";
      this.$http.post(url, this.product).then(response => {
      this.product = new Product();
      $('#productModal').modal('hide');
      notie.alert("success", "Success.", 1.5);
      // TODO: add event and automatically update parent
      this.$emit("save-product", response.body);
      
    }, response => {
    // error callback
    notie.alert('error', response.statusText, 1.5);
    });
    }
  }
});

var products = Vue.component("products", {
  template: "#products",
  data: function() {
    return {
      products: [],
      currentProduct: {}
    };
  },
  methods: {
    newProduct: function() {
      $('#productModal').modal();
    },
    updateProducts: function(prod) {
      this.products.push(prod);
    },
    editProduct: function(product) {
    
    },
    deleteProduct: function(product) {
       var url = "/api/products/" + product.id;
        this.$http.delete(url).then(response => {
        // user feedback?
        // delete product from array
        var indexToRemove;
        this.products.forEach(function(currProd, index) {
          if(currProd.id === product.id) {
            indexToRemove = index;
          }
        });
        this.products.splice(indexToRemove, 1);
        notie.alert("success", "successfully deleted product '" + product.name +"'", 2);
    }, response => {
    // error callback
    notie.alert('error', response.statusText, 1.5);
    });
    },
    updateProduct: function(product) {
      if(this.currentProduct.name !== product.name || this.currentProduct.price !== product.price) {
        // PUT
        var url = "/api/products/" + product.id;
        this.$http.put(url, product).then(response => {
        // user feedback?
    }, response => {
    // error callback
    notie.alert('error', response.statusText, 1.5);
    });
      }
    },
    getProduct: function(product) {
      this.currentProduct.name = product.name;
      this.currentProduct.price = product.price;
    }
  },
  created: function() {
      var url = "/api/products";
      this.$http.get(url).then(response => {
      this.products = response.body;
    }, response => {
    // error callback
    notie.alert('error', response.statusText, 1.5);
    });
  },
});

// ---------------------------
//            CART
// ---------------------------
var cart = Vue.component("cart", {
 template: "#cart",
  data: function()  {
      return {
    cart: []
      };
  },
  methods: {
    saveCart: function() {
        // TODO
        // POST to api/cart/
        // this.cart ist nicht ganz in der Form in der wir es an die API schicken wollen.
        var url = "/api/cart";
        this.$http.post(url, this.cart).then(response => {
          notie.alert("success", "success", 1.5);
        }, response => {
          // error callback
          notie.alert("error", response.statusText, 1.5);
        });
      }
  },
  created: function() {
      var url = "/api/cart";
      this.$http.get(url).then(response => {
      this.cart = response.body;
  }, response => {
  // error callback
  notie.alert("error", response.statusText, 1.5);
  });
  },
  computed: {
    total: function() {
      // TODO: update on propchanged
      var total = 0;
      if(this.cart !== undefined) {
      for(var i = 0; i < this.cart.length; i++) {
        total += this.cart[i].quantity * this.cart[i].price;
      }
      }
      return total;
    }
  }
});

Vue.filter("currency", function(value) {
  if(value!== null) {
    return "€ " + value.toFixed(2);
  }
  return 0;
});

new Vue({
  el: '#main'
});


// MODELS
function Product() {
  this.name = "",
  this.price = 0
}