package com.api.ejemplo.apidocker.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.api.ejemplo.apidocker.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    
    
}
