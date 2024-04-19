describe('Gym Machine Form', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
        cy.contains('Entrar').click()
        cy.get('input[name="username"]').type('aaromo');
        cy.get('input[name="password"]').type('musclemate123');
        cy.get('button[type="submit"]').click();
        cy.contains('Mis Eventos').click();
    });


    it('debería mostrar los detalles asociados a la maquina', () => {
        cy.contains('Yoga Class').click();
        cy.contains('Yoga Class').should('be.visible');
        cy.contains('Relaxing yoga session for beginners').should('be.visible');
        cy.contains('Aforo: 20').should('be.visible');
        cy.contains('Asistentes: 15').should('be.visible');
        cy.contains('Instructor: John Doe').should('be.visible');
        cy.contains('Fecha: 15 de marzo de 2024').should('be.visible');
        cy.contains('Duración: 01:30:00').should('be.visible');
        cy.contains('Intensidad: Baja').should('be.visible');
        cy.contains('Reservable:').should('be.visible');
        cy.contains('Noticia:').should('be.visible');
        cy.contains('Editar').should('be.visible');
        cy.contains('Eliminar').should('be.visible');
    });

    it('debería poder editar una maquina', () => {
        cy.contains('Yoga Class').click();
        cy.contains('Editar').click();

        cy.get('input[name="name"]').clear().type('Yoga Class Extra');
        cy.contains('Guardar').click();
        cy.contains('Yoga Class Extra').should('be.visible');
    });

    /*it('debería poder editar una maquina', () => {
        cy.contains('Yoga Class').click();
        cy.contains('Editar').click();

        cy.get('button[name="isNotice"]').check();
        cy.contains('Guardar').click();
        cy.contains('button[name="isNotice"]').should('be.checked');
    });*/

    it('debería poder eliminar una maquina', () => {
        cy.contains('Yoga Class Extra').click();
        cy.contains('Eliminar').click();

        cy.contains('Éxito! El evento ha sido eliminado correctamente.').should('be.visible');
        cy.visit('http://localhost:5173/owner/events');
        cy.contains('Yoga Class').should('not.exist');
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
