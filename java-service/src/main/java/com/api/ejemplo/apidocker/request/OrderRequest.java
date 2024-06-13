package com.api.ejemplo.apidocker.request;

import java.util.List;

import com.api.ejemplo.apidocker.model.Order;
import com.api.ejemplo.apidocker.model.OrderDetail;

public class OrderRequest {
    private Order order;
    private List<OrderDetail> orderDetails;

    // Getters and setters
    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public List<OrderDetail> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }
}

