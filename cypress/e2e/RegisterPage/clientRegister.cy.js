describe('ClientRegister', () => {

    it('debería mostrar el formulario de registro', () => {
      cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
      cy.contains('Registrarse').click();
      cy.contains('Registro de nuevo propietario').should('be.visible');
      cy.get('form').should('exist');
    });
  
    it('debería permitir al usuario completar el formulario y registrarse', () => {
      cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
      cy.contains('Registrarse').click();
      cy.get('input[name="name"]').type('Nombre');
      cy.get('input[name="lastName"]').type('Apellido');
      cy.get('input[name="email"]').type('correo@gmail.com');
      cy.get('input[name="phoneNumber"]').type('123456789');
      cy.get('input[name="address"]').type('Dirección');
      cy.get('input[name="username"]').type('Usuario');
      cy.get('input[name="password"]').type('Contraseña123');
      cy.get('input[type="checkbox"]').check();
  
      cy.get('button[type="submit"]').click();
  
      // Verificar que se haya redirigido a la página de inicio de sesión
      cy.url().should('include', '/login');
    });

    it('debería poder ir a la pagina de terminos y condiciones', () => {
      cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
      cy.contains('Registrarse').click();
      cy.contains('Términos y Condiciones').click();

      // Verificar que se muestre un mensaje de error
      cy.url().should('include', '/terms-conditions');
    });
  
    it('no debería permitir al usuario registrarse con nombre ya existente', () => {
      cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
      cy.contains('Registrarse').click();
      cy.get('input[name="name"]').type('Nombre');
      cy.get('input[name="lastName"]').type('Apellido');
      cy.get('input[name="email"]').type('correo@gmail.com');
      cy.get('input[name="phoneNumber"]').type('123456789');
      cy.get('input[name="address"]').type('Dirección');
      cy.get('input[name="username"]').type('Usuario');
      cy.get('input[name="password"]').type('Contraseña123');
      cy.get('input[type="checkbox"]').check();
  
      cy.get('button[type="submit"]').click();

      // Verificar que se muestre un mensaje de error
      cy.contains('Error al crear propietario').should('be.visible');
    });

    it('no debería permitir al usuario registrarse con correo invalido', () => {
      cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
      cy.contains('Registrarse').click();
      cy.get('input[name="name"]').type('Nombre');
      cy.get('input[name="lastName"]').type('Apellido');
      cy.get('input[name="email"]').type('correo@correo.com');
      cy.get('input[name="phoneNumber"]').type('123456789');
      cy.get('input[name="address"]').type('Dirección');
      cy.get('input[name="username"]').type('Usuario');
      cy.get('input[name="password"]').type('Contraseña123');
      cy.get('input[type="checkbox"]').check();
  
      cy.get('button[type="submit"]').click();

      // Verificar que se muestre un mensaje de error
      cy.contains('Error al crear propietario').should('be.visible');
    });

    it('no debería permitir al usuario registrarse con contraseña corta', () => {
      cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
      cy.contains('Registrarse').click();
      cy.get('input[name="name"]').type('Nombre');
      cy.get('input[name="lastName"]').type('Apellido');
      cy.get('input[name="email"]').type('correo@gmail.com');
      cy.get('input[name="phoneNumber"]').type('123456789');
      cy.get('input[name="address"]').type('Dirección');
      cy.get('input[name="username"]').type('Usuario');
      cy.get('input[name="password"]').type('Contra');
      cy.get('input[type="checkbox"]').check();
  
      cy.get('button[type="submit"]').click();

      // Verificar que no se ha realizado el registro
      cy.url().should('include', '/register-client');
    });

    it('debería mostrar un mensaje de error si se intenta registrar sin aceptar los términos y condiciones', () => {
      cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
      cy.contains('Registrarse').click();
      cy.get('input[name="name"]').type('Nombre');
      cy.get('input[name="lastName"]').type('Apellido');
      cy.get('input[name="email"]').type('correo@gmail.com');
      cy.get('input[name="phoneNumber"]').type('123456789');
      cy.get('input[name="address"]').type('Dirección');
      cy.get('input[name="username"]').type('UsuarioMal');
      cy.get('input[name="password"]').type('contraseña123');
  
      cy.get('button[type="submit"]').click();
  
      // Verificar que se muestre un mensaje de error
      cy.contains('Debes aceptar los Términos y Condiciones para registrarte').should('be.visible');
    });

  });
  