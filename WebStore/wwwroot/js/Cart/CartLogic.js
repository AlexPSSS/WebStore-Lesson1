﻿Cart = {
    _properties: {
        getCartViewLink: "",
        addToCartLink: "",
        decrementLink: "",
        removeFromCartLink: "",
        removeAllLink: ""
    },

    init: function (properties) {
        $.extend(Cart._properties, properties);

        Cart.initEvents();
    },

    initEvents: function () {
        $(".add-to-cart").click(Cart.addToCart);
        $(".cart_quantity_up").click(Cart.incrementItem);
        $(".cart_quantity_down").click(Cart.decrementItem);
        $(".cart_quantity_delete").click(Cart.removeFromCart);
    },

    addToCart: function (event) {
        event.preventDefault();

        var button = $(this);
        const id = button.data("id"); //data-id="..."

        //$.get(Cart._properties.addToCartLink + "/" + id)
        $.get(`${Cart._properties.addToCartLink}/${id}`)
            .done(function () {
                Cart.showToolTip(button);
                Cart.refreshCartView();
            })
            .fail(function () { console.log("addToCart file"); });
    },

    showToolTip: function (button) {
        button.tooltip({ title: "Добавлено в корзину" }).tooltip("show");
        setTimeout(function () {
            button.tooltip("destroy");
        }, 500);
    },

    refreshCartView: function () {
        var container = $("#cart-container");
        $.get(Cart._properties.getCartViewLink)
            .done(function (cartHtml) {
                container.html(cartHtml);
            })
            .fail(function () { console.log("refreshCartView fail"); });
    },

    incrementItem: function (event) {
        event.preventDefault();

        var button = $(this);
        const id = button.data("id");

        var container = button.closest("tr");

        $.get(Cart._properties.addToCartLink + "/" + id)
            .done(function () {
                const count = parseInt($(".cart_quantity_input", container).val());
                $(".cart_quantity_input", container).val(count + 1);

                Cart.refreshPrice(container);
                Cart.refreshCartView();
            })
            .fail(function () { console.log("incrementItem fail"); });
    },

    decrementItem: function (event) {
        event.preventDefault();

        var button = $(this);
        const id = button.data("id");

        var container = button.closest("tr");

        $.get(Cart._properties.decrementLink + "/" + id)
            .done(function () {
                const count = parseInt($(".cart_quantity_input", container).val());
                if (count > 1) {
                    $(".cart_quantity_input", container).val(count - 1);
                    Cart.refreshPrice(container);
                } else {
                    container.remove();
                    Cart.refreshTotalPrice();
                }
                Cart.refreshCartView();
            })
            .fail(function () { console.log("decrementItem fail"); });
    },

    removeFromCart: function (event) {
        event.preventDefault();

        var button = $(this);
        const id = button.data("id");

        $.get(Cart._properties.removeFromCartLink + "/" + id)
            .done(function () {
                button.closest("tr").remove();
                Cart.refreshTotalPrice();
                Cart.refreshCartView();
            })
            .fail(function () { console.log("removeFromCart fail"); });
    },

    refreshPrice: function (container) {
        const quantity = parseInt($(".cart_quantity_input", container).val());
        const price = parseFloat($(".cart_price", container).data("price"));

        const totalPrice = quantity * price;

        const value = totalPrice.toLocaleString("ru-RU", { style: "currency", currency: "RUB" });
        $(".cart_total_price", container).data("price", totalPrice);
        $(".cart_total_price", container).html(value);

        Cart.refreshTotalPrice();
    },

    refreshTotalPrice: function () {
        var total = 0;

        $(".cart_total_price").each(function () {
            const price = parseFloat($(this).data("price"));
            total += price;
        });

        const value = total.toLocaleString("ru-RU", { style: "currency", currency: "RUB" });
        $("#total-order-sum").html(value);
    }
}