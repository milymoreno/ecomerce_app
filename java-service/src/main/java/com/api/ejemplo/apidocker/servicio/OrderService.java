package com.api.ejemplo.apidocker.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.ejemplo.apidocker.repository.OrderRepository;
import com.api.ejemplo.apidocker.repository.OrderDetailRepository;

import com.api.ejemplo.apidocker.model.Order;
import com.api.ejemplo.apidocker.model.OrderDetail;
import com.api.ejemplo.apidocker.components.OrderCreatedEventProducer;

//import java.util.HashMap;
import java.util.List;
//import java.util.Map;
import java.util.Optional;


@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderCreatedEventProducer orderCreatedEventProducer;

    @Transactional
    public Order createOrder(Order order, List<OrderDetail> orderDetails) {
        Order savedOrder = orderRepository.save(order);

        // Crear un mapa de productos y cantidades
        //Map<Integer, Integer> productQuantities = new HashMap<>();
        for (OrderDetail detail : orderDetails) {
            detail.setOrder(savedOrder);
            orderDetailRepository.save(detail);
            //productQuantities.put(detail.getProductId(), detail.getQuantity());
            orderCreatedEventProducer.sendOrderCreatedEvent(detail.getProductId(), detail.getQuantity());
        }

        // Llamar al método de publicación del evento de creación de la orden
        //orderCreatedEventProducer.sendOrderCreatedEvent(savedOrder, productQuantities);

        return savedOrder;
    }

    public Optional<Order> getOrder(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    
    @Transactional
    public Order updateOrder(Long id, Order newOrderData, List<OrderDetail> newOrderDetails) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);

        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();
            existingOrder.setDate(newOrderData.getDate());
            existingOrder.setStatus(newOrderData.getStatus());
            existingOrder.setDeliveryAddress(newOrderData.getDeliveryAddress());
            existingOrder.setPaymentMethod(newOrderData.getPaymentMethod());

            // Eliminar los detalles de pedido existentes
            orderDetailRepository.deleteByOrderId(id);

            // Guardar los nuevos detalles de pedido
            for (OrderDetail detail : newOrderDetails) {
                detail.setOrder(existingOrder);
                orderDetailRepository.save(detail);
            }

            return orderRepository.save(existingOrder);
        } else {
            return null;
        }
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}


