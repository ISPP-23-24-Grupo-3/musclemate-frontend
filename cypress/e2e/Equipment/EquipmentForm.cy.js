describe('Gym Machine Form', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
      cy.contains('Entrar').click()
      cy.get('input[name="username"]').type('aaromo');
      cy.get('input[name="password"]').type('agustin123');
      cy.get('button[type="submit"]').click();
      cy.contains('Mis Máquinas').click();
      cy.contains('Añadir máquina').click();
    });
  
    it('debería mostrar un mensaje de error al intentar enviar el formulario con campos vacíos', () => {
      cy.get('button[type="submit"]').click();
  
      // Verificar que se muestren mensajes de error para los campos requeridos
      cy.contains('Este campo es obligatorio').should('be.visible');
    });
  
    it('debería mostrar un mensaje de error al intentar enviar el formulario con campos inválidos', () => {
      cy.get('input[name="name"]').type('123'); // Nombre corto
      cy.get('button[type="submit"]').click();
      // Verificar que se muestren mensajes de error para campos inválidos
      cy.contains('El nombre de la máquina debe tener más de 5 caracteres').should('be.visible');
    });
  
    it('debería mostrar un mensaje de error al intentar enviar el formulario con campos inválidos', () => {
      cy.get('input[name="brand"]').type('12'); // Marca corta  
      cy.get('button[type="submit"]').click();
  
      // Verificar que se muestren mensajes de error para campos inválidos
      cy.contains('La marca debe tener más de 3 caracteres').should('be.visible');
    });
  

    it('debería mostrar un mensaje de error al intentar enviar el formulario con campos inválidos', () => {
      cy.get('textarea[name="description"]').type('123456789'); // Descripción corta
      cy.get('button[type="submit"]').click();
  
      // Verificar que se muestren mensajes de error para campos inválidos
      cy.contains('La descripción debe tener más de 10 caracteres').should('be.visible');
    });
    

    it('debería mostrar un mensaje de error al intentar enviar el formulario con campos inválidos', () => {
      cy.get('select[name="gym"]').select(''); // Gimnasio no seleccionado
  
      cy.get('button[type="submit"]').click();
  
      // Verificar que se muestren mensajes de error para los campos requeridos
      cy.contains('Este campo es obligatorio').should('be.visible');
    });

    it('debería crear una nueva máquina de gimnasio correctamente', () => {
      // Rellenar el formulario con datos válidos
      cy.get('input[name="name"]').type('Máquina de prueba');
      cy.get('input[name="brand"]').type('Marca de prueba');
      cy.get('input[name="serial_number"]').type('123456');
      cy.get('textarea[name="description"]').type('Descripción de la máquina de prueba');
      cy.get('select[name="muscular_group"]').select('arms'); // Seleccionar grupo muscular
      cy.get('select[name="gym"]').select('MasMusculoFit Sevilla MMFit Gym'); // Seleccionar gimnasio existente
  
      // Enviar el formulario
      cy.get('button[type="submit"]').click();
  
      // Verificar que se redirige a la página correcta
      cy.url().should('include', '/owner/equipments');
    });
  
    // Puedes escribir más pruebas para otros casos según sea necesario
  });
  