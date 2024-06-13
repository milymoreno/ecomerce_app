<?php

use App\Jobs\ProcessRabbitMQEvent;

class EventController extends Controller
{

public function processRabbitMQEvent()
{
    dispatch(new ProcessRabbitMQEvent())->onQueue('product-quantity-queue');
}

}
