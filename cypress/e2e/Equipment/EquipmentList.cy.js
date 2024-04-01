describe('MachineList', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
        cy.contains('Entrar').click()
        cy.get('input[name="username"]').type('aaromo');
        cy.get('input[name="password"]').type('musclemate123');
        cy.get('button[type="submit"]').click();
        cy.contains('Mis Máquinas').click();
    });

    it('debería mostrar la lista de máquinas correctamente', () => {
        // Verificar que el encabezado "Mis Máquinas" se muestre correctamente
        cy.contains('Mis Máquinas').should('be.visible');

        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('input[placeholder="Buscar máquina"]').should('be.visible');

        // Verificar que se muestre el botón "Añadir máquina" y sea clicle
        cy.contains('Añadir máquina').should('be.visible');

        // Verificar que al menos una máquina se muestre en la lista
        cy.get('button[name="maquina"]').its('length').should('be.gt', 1);

        // Simular hacer clic en una máquina de la lista y verificar que redirige correctamente
        cy.get('button[name="maquina"]').first().click();
        cy.url().should('include', '/234567'); // Ajusta la ruta según corresponda
    });

    it('debería mostrar la máquina buscada correctamente', () => {
        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('input[placeholder="Buscar máquina"]').type('Banda de resistencia');
        cy.get('button[name="maquina"]').its('length').should('eq', 1);
        cy.contains('Banda de resistencia').should('be.visible');
    });

    it('debería mostrar las máquinas filtradas correctamente', () => {
        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('button[name="filter"]').click();
        cy.contains('arms').click();
        cy.get('button[name="maquina"]').its('length').should('eq', 3);
        cy.contains('Mancuernas').should('be.visible');
        cy.contains('Máquina de prueba').should('be.visible');
        cy.contains('Press Militar').should('be.visible');
    });

    it('debería mostrar las máquinas filtradas correctamente', () => {
        // Verificar que los elementos de filtro y ordenación estén presentes
        cy.get('button[name="filter"]').click();
        cy.get('button[name="reverse_sort"]').click();

        // Simular hacer clic en una máquina de la lista y verificar que redirige correctamente
        cy.get('button[name="maquina"]').first().click();
        cy.url().should('include', '/101234'); // Ajusta la ruta según corresponda
    });
});
