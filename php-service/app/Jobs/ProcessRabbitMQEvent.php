<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessRabbitMQEvent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $eventData;

    public function __construct($eventData)
    {
        $this->eventData = $eventData;
    }

    
    public function handle()
    {
   //$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');

   error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED & ~E_NOTICE);
//$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
    $connection = new AMQPStreamConnection(
    config('queue.connections.rabbitmq.host'),
    config('queue.connections.rabbitmq.port'),
    config('queue.connections.rabbitmq.login'),
    config('queue.connections.rabbitmq.password'),
    config('queue.connections.rabbitmq.vhost')
    );
    $channel = $connection->channel();
    

    $channel->queue_declare('product-quantity-queue', false, true, false, false);

    echo ' [*] Waiting for product updates. To exit press CTRL+C', "\n";

    $callback = function ($msg) {
        echo " [x] Received ", $msg->body, "\n";
        $data = json_decode($msg->body, true);

        if (isset($data['product_id']) && isset($data['quantity'])) {
            $this->updateProductQuantity($data['product_id'], $data['quantity']);
        }
    };


    $channel->basic_consume('product-quantity-queue', '', false, true, false, false, $callback);

    while (count($channel->callbacks)) {
        $channel->wait();
    }

    $channel->close();
    $connection->close();

    //return Command::SUCCESS;
    }

    protected function updateProductQuantity($productId, $quantity)
    {
        $product = Product::find($productId);

        if ($product) {
            $product->quantity -= $quantity;
            $product->save();
        }
    }

}
