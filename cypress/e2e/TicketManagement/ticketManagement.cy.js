describe('TicketManagement', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
        cy.contains('Iniciar Sesión').click()
        cy.get('input[name="username"]').type('aaromo');
        cy.get('input[name="password"]').type('musclemate123');
        cy.get('button[type="submit"]').click();
        cy.contains('Ver Incidencias').click();
    });

    it('debería mostrar la lista de incidencia correctamente', () => {
        // Verificar que el encabezado "Mis Máquinas" se muestre correctamente
        cy.contains('Lista de Incidencias').should('be.visible');

        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('input[placeholder="Buscar por máquina o gimnasio"]').should('be.visible');

        cy.contains('Anterior').should('be.visible');
        cy.contains('Siguiente').should('be.visible');

        // Verificar que al menos una máquina se muestre en la lista
        cy.contains('Ticket 1').should('be.visible');
        cy.contains('Ticket 2').should('be.visible');
        cy.contains('Ticket 3').should('be.visible');
    });

    it('debería mostrar la incidencia buscada correctamente', () => {
        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('input[placeholder="Buscar por máquina o gimnasio"]').type('Colchoneta');
        cy.contains('Ticket').its('length').should('be.eq', 1);
        cy.contains('Ticket 3').should('be.visible');
    });

    it('debería resolver una incidencia correctamente', () => {
        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.contains('No resuelto').click();
        cy.contains('Resuelto').its('length').should('be.eq', 1);
    });

});