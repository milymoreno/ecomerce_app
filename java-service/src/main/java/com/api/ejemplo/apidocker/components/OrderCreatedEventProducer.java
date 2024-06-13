package com.api.ejemplo.apidocker.components;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

//import com.api.ejemplo.apidocker.model.Order;
//import com.api.ejemplo.apidocker.configure.RabbitMQConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
//import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import com.rabbitmq.client.MessageProperties;



@Component
public class OrderCreatedEventProducer {

    private static final String EXCHANGE_NAME = "order-exchange";
    private static final String QUEUE_NAME = "product-quantity-queue";

    private final ConnectionFactory connectionFactory;

    private ObjectMapper objectMapper;
    

    // Configurar el tamaño máximo del cuerpo del mensaje entrante
    //connectionFactory.setMaxInboundMessageBodySize(1024 * 1024); // Establecer a 1 MB, por ejemplo

   // @Autowired
    public OrderCreatedEventProducer(ConnectionFactory connectionFactory) {
        this.objectMapper = new ObjectMapper();
        this.connectionFactory = connectionFactory;
        createQueue();
    }

   /* public void sendOrderCreatedEvent(Order order, Map<Integer, Integer> productQuantities) {
        try (Connection connection = connectionFactory.newConnection();
             Channel channel = connection.createChannel()) {
            channel.basicPublish(EXCHANGE_NAME, "", MessageProperties.PERSISTENT_TEXT_PLAIN, serializeMessage(order, productQuantities));
            System.out.println(" [x] Sent order created event");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }*/

    public void sendOrderCreatedEvent(int productId, int quantity) {
        try (Connection connection = connectionFactory.newConnection();
             Channel channel = connection.createChannel()) {
            channel.basicPublish(EXCHANGE_NAME, "", MessageProperties.PERSISTENT_TEXT_PLAIN, serializeMessage(productId, quantity));
            System.out.println(" [x] Sent order created event producto: "+productId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private byte[] serializeMessage(int productId, int quantity) throws IOException {
        // Creamos un mapa para representar los datos del detalled de la orden
        Map<String, Object> orderDetailData = new HashMap<>();
        orderDetailData.put("product_id", productId);
        orderDetailData.put("quantity", quantity);

        // Convertimos el mapa a JSON como una cadena
        String jsonMessage = objectMapper.writeValueAsString(orderDetailData);

        // Convertimos la cadena JSON a un array de bytes y lo devolvemos
        return jsonMessage.getBytes();
    }

    private void createQueue() {
        try (Connection connection = connectionFactory.newConnection();
             Channel channel = connection.createChannel()) {
            channel.queueDeclare(QUEUE_NAME, true, false, false, null);
            channel.exchangeDeclare(EXCHANGE_NAME, "fanout");
            channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "");
            System.out.println(" [*] Queue '" + QUEUE_NAME + "' and exchange '" + EXCHANGE_NAME + "' created successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

