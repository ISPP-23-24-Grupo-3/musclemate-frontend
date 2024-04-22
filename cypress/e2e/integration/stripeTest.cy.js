describe('Gym Machine Form', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/'); // Asegúrate de ajustar la ruta según corresponda
        cy.contains('Iniciar Sesión').click();
        cy.get('input[name="username"]').type('aaromo');
        cy.get('input[name="password"]').type('musclemate123');
        cy.get('button[type="submit"]').click();

        cy.intercept('GET', 'https://api.stripe.com/v1/products?active=true&expand[0]=data.default_price', {
            statusCode: 200,
            body: [
                {
                    id: 'price_1',
                    name: 'Plan básico',
                    price: 1000,
                    features: ['Feature 1', 'Feature 2']
                },
                {
                    id: 'price_2',
                    name: 'Plan premium',
                    price: 2000,
                    features: ['Feature 3', 'Feature 4']
                }
            ]
        }).as('getPricingPlans');

    });

    it('deberia poder comprar una suscripcion', () => {
        cy.visit('http://localhost:5173/owner/pricing');
        cy.wait('@getPricingPlans');
        cy.contains('Elegir Plan').eq(1).click();
    });



});