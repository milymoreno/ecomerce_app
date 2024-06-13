package com.api.ejemplo.apidocker.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.api.ejemplo.apidocker.repository.UsuarioRepository;
import com.api.ejemplo.apidocker.model.Usuario;

@Service
public class UsuarioService {
	@Autowired
	private UsuarioRepository repositorio;
	
	 public List<Usuario> getAllEntities() {
	        return repositorio.findAll();
	 }

	
}
