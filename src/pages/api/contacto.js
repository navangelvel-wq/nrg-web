import { Resend } from 'resend';

// En Astro usamos import.meta.env en lugar de process.env
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST = async ({ request }) => {
  try {
    const data = await request.formData();
    
    // Extraemos la información del formulario
    const nombre = data.get('nombre');
    const apellidos = data.get('apellidos');
    const empresa = data.get('empresa') || 'No especificada';
    const servicio = data.get('servicio');
    const email = data.get('email');
    const telefono = data.get('telefono') || 'No especificado';
    const mensaje = data.get('mensaje') || 'Sin mensaje adicional';

    // Validación obligatoria en servidor
    if (!nombre || !apellidos || !servicio || !email) {
      return new Response(
        JSON.stringify({ message: 'Por favor, llene los campos obligatorios (*).' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enviamos el correo a tu dirección registrada en Resend (Modo Sandbox de prueba)
    await resend.emails.send({
      from: 'Web NRG <onboarding@resend.dev>', 
      to: 'navangelvel@gmail.com', 
      subject: `[Contacto Web] Prospecto interesado en: ${servicio}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #171717;">
          <h2 style="color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Nuevo Registro de Contacto - NRG</h2>
          <p><strong>Nombre Completo:</strong> ${nombre} ${apellidos}</p>
          <p><strong>Empresa:</strong> ${empresa}</p>
          <p><strong>Servicio:</strong> ${servicio}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Teléfono:</strong> ${telefono}</p>
          <br/>
          <p><strong>Mensaje del cliente:</strong></p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; font-style: italic;">
            "${mensaje}"
          </div>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ message: '¡Mensaje enviado con éxito!' }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Si algo falla, forzamos una respuesta estructurada en JSON para evitar el error de parsing en la web
    return new Response(
      JSON.stringify({ message: 'Error interno en el servidor.', error: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};