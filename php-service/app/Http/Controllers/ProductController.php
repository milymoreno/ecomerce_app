<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;




class ProductController extends Controller
{
    public function index()
    {
        return Product::with('images')->get();
    }

    public function store(Request $request)
    {

    /*$data = $request->all();
    $files = $request->file();
    $headers = $request->headers->all();

    Log::info('Files: ', $files);
    Log::info('Data: ', $data);
    //Log::info('Headers: ', $headers);



    return response()->json(['headers' => $headers, 'data' => $data, 'files' => $files]);*/
       
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product = Product::create($request->only(['name', 'description', 'price', 'quantity']));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('public/images');
                $product->images()->create(['path' => $path]);
            }
        }

        return $product->load('images');
    }

    public function show(Product $product)
    {
        return $product->load('images');
    }

   /* public function update(Request $request, Product $product)//put no funciono el request
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product->update($request->only(['name', 'description', 'price', 'quantity']));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('public/images');
                $product->images()->create(['path' => $path]);
            }
        }

        return $product->load('images');
    }*/

    function update(Request $request, Product $product)
	{
    Log::info('Request received for updating product', ['product_id' => $product->id]);
	
    $product = Product::findOrFail($request->id);

    try {

        $request->validate([            
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    } catch (ValidationException $e) {
        // Imprime los mensajes de error de la validación
        print_r($e->errors());
        //Log::info('Erros: ', print_r($e->errors()));
        return response()->json($e->errors(), 422);
    }

    Log::info('Validation passed');

    $product->update($request->only(['name', 'description', 'price', 'quantity']));
    

    if ($request->hasFile('images')) {
        // Eliminar las imágenes anteriores
        $product->images()->delete();
        Log::info('Images provided');
        foreach ($request->file('images') as $image) {
            $path = $image->store('public/images');
            Log::info('Image stored', ['path' => $path]);
            $product->images()->create(['path' => $path]);
        }
    }

    Log::info('Product updated successfully');

    return $product->load('images');
}




    public function deleteImage(Product $product, Image $image)
    {
        // Eliminar la imagen
        Storage::disk('public')->delete($image->path);
        $image->delete();
        return response()->json(null, 204);
    }


    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
    

    


}
