package com.api.ejemplo.apidocker.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.api.ejemplo.apidocker.model.Usuario;
import com.api.ejemplo.apidocker.servicio.UsuarioService;

@RestController
@RequestMapping("/api")
public class UsuarioController {

	@Autowired	
	private UsuarioService servicio;
	
	@GetMapping("/usuarios")
	public List<Usuario>ListarUsuarios(){
		return servicio.getAllEntities();
	}
   
}    
