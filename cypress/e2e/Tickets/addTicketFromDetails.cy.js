describe('AddTicketFromDetails', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
        cy.contains('Iniciar Sesión').click()
        cy.get('input[name="username"]').type('carliberal');
        cy.get('input[name="password"]').type('musclemate123');
        cy.get('button[type="submit"]').click();
        cy.get('button[class="lg:hidden').click();
        cy.contains('Máquinas del gimnasio').click();
        cy.get('button[class="lg:hidden').click();
        cy.contains('Banda de resistencia').click();
        cy.contains('Añadir incidencia').click();
    });

    it('debería mostrar el formulario correctamente', () => {
        // Verificar que el encabezado "Mis Máquinas" se muestre correctamente
        cy.contains('Crear Incidencia').should('be.visible');   

        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.contains('Asunto').should('be.visible');
        cy.get('input[id="label"]').should('be.visible');

        cy.contains('Descripción').should('be.visible');
        cy.get('textarea[id="description"]').should('be.visible');
    });

    it('debería crear una incidencia correctamente', () => {
        cy.get('input[id="label"]').type('Incidencia 1');
        cy.get('textarea[id="description"]').type('Descripción de la Incidencia 1');
        cy.get('button[type="submit"]').click();
        cy.wait(2000);
        cy.contains('Ticket 1').should('be.visible');
    });

    it('no debería crear una incidencia con datos incompletos Asunto', () => {
        cy.get('textarea[id="description"]').type('Descripción de la Incidencia 1');
        cy.get('button[type="submit"]').click();
        cy.contains('El asunto y la descripción son obligatorios.').should('be.visible');
    });

    it('no debería crear una incidencia con datos incompletos Descripcion', () => {
        cy.get('input[id="label"]').type('Incidencia 1');
        cy.get('button[type="submit"]').click();
        cy.contains('El asunto y la descripción son obligatorios.').should('be.visible');
    });

    it('debería haber asignado correctamente la máquina ', () => {
        cy.get('button[class="lg:hidden').click();
        cy.contains('Mis Incidencias').click();
        cy.get('button[class="lg:hidden').click();
        cy.contains('Incidencia 1').should('be.visible');
        cy.contains('Banda de resistencia').should('be.visible');

    })

});