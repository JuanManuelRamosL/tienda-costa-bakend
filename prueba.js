
// SDK de Mercado Pago
const { MercadoPagoConfig, Payment, Preference } = require('mercadopago');
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-606095260540143-111014-79210c1a47e51601f405331300802dfc-2090297928' });


const preference = new Preference(client);


preference.create({
  body: {
    items: [
      {
        title: 'Mi producto',
        quantity: 1,
        unit_price: 2000
      }
    ],
  }
})
.then(console.log)
.catch(console.log);
