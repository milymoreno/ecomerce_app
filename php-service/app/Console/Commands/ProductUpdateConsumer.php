<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Models\Product;

class ProductUpdateConsumer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rabbitmq:consume-events';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Consume eventos de la cola RabbitMQ';

    /**
     * Execute the console command.
     *
     * @return int
     */

    public function handle()
    {
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

    return Command::SUCCESS;
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
