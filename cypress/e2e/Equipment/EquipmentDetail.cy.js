describe('Gym Machine Form', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
      cy.contains('Entrar').click()
      cy.get('input[name="username"]').type('aaromo');
      cy.get('input[name="password"]').type('musclemate123');
      cy.get('button[type="submit"]').click();
      cy.contains('Mis Máquinas').click();
    });


    it('debería mostrar los detalles asociados a la maquina', () => {
      cy.contains('Cinta de correr').click();
      cy.contains('Cinta de correr').should('be.visible');
      cy.contains('Cinta de correr plegable con motor de 2.5 HP').should('be.visible');
      cy.contains('Marca E').should('be.visible');
      cy.contains('McFIT Sevilla Palacio de Congresos').should('be.visible');
      cy.contains('Otros').should('be.visible');
      cy.contains('CDCT005').should('be.visible');
    });

    it('debería mostrar los tickets asociados a la maquina con tickets', () => {
      cy.contains('Cinta de correr').click();
      cy.contains('Ticket 4').should('be.visible');
      cy.contains('Ticket 1').should('be.visible');
      cy.contains('No Resuelto').should('be.visible');
      cy.contains('Resuelto').should('be.visible');
    });

    it('no debería mostrar los tickets en una maquina sin tickets', () => {
      cy.contains('Banda de resistencia').click();
      cy.contains('No hay tickets disponibles.').should('be.visible');
    });

    it('debería poder editar una maquina', () => {
      cy.contains('Cinta de correr').click();
      cy.contains('Editar').click();

      cy.get('input[name="name"]').type('Cinta de correr 2');
      cy.contains('Guardar').click();
      cy.contains('Cinta de correr 2').should('be.visible');
    });
  
   /* it('debería mostrar un mensaje de error al intentar enviar el formulario con campos inválidos', () => {
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
    });*/
  
    // Puedes escribir más pruebas para otros casos según sea necesario
  });
  