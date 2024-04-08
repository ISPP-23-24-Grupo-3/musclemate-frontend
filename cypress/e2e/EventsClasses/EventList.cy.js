describe('EventList', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
        cy.contains('Entrar').click()
        cy.get('input[name="username"]').type('aaromo');
        cy.get('input[name="password"]').type('musclemate123');
        cy.get('button[type="submit"]').click();
        cy.contains('Mis Eventos').click();
    });

    it('debería mostrar la lista de máquinas correctamente', () => {
        // Verificar que el encabezado "Mis Máquinas" se muestre correctamente
        cy.contains('Lista de Eventos').should('be.visible');

        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('input[placeholder="Buscar evento"]').should('be.visible');

        // Verificar que se muestre el botón "Añadir máquina" y sea clicle
        cy.contains('Añadir evento').should('be.visible');

        // Verificar que al menos una máquina se muestre en la lista
        cy.get('button[name="event"]').its('length').should('be.gt', 1);

        // Simular hacer clic en una máquina de la lista y verificar que redirige correctamente
        cy.get('button[name="event"]').first().click();
        cy.url().should('include', 'owner/events/759846'); // Ajusta la ruta según corresponda
    });

    it('debería mostrar la máquina buscada correctamente', () => {
        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('input[placeholder="Buscar evento"]').type('Yoga Class');
        cy.get('button[name="event"]').its('length').should('eq', 1);
        cy.contains('Yoga Class').should('be.visible');
    });

    it('debería mostrar las máquinas filtradas correctamente', () => {
        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('button[name="filter"]').click();
        cy.get('input[name="date_filter"]').type('2024-03-15');
        cy.get('button[name="event"]').its('length').should('eq', 1);
        cy.contains('Yoga Class').should('be.visible');
    });

    it('debería mostrar las máquinas filtradas correctamente', () => {
        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('button[name="filter"]').click();
        cy.get('button[name="reverse_sort"]').click();

        // Simular hacer clic en una máquina de la lista y verificar que redirige correctamente
        cy.get('button[name="event"]').first().click({force:true});
        cy.url().should('include', 'owner/events/759847'); // Ajusta la ruta según corresponda
    });
});
