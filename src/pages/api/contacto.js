export const POST = async ({ request }) => {
  try {
    const apiKey = import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ message: 'Error: Falta la API Key de Resend en Vercel.' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Import dinámico para que Vercel no falle al arrancar
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    
    const data = await request.formData();
    
    const nombre = data.get('nombre');
    const apellidos = data.get('apellidos');
    const empresa = data.get('empresa') || 'No especificada';
    const servicio = data.get('servicio');
    const email = data.get('email');
    const telefono = data.get('telefono') || 'No especificado';
    const mensaje = data.get('mensaje') || 'Sin mensaje adicional';

    if (!nombre || !apellidos || !servicio || !email) {
      return new Response(
        JSON.stringify({ message: 'Faltan campos obligatorios.' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await resend.emails.send({
      from: 'Web NRG <onboarding@resend.dev>', 
      to: 'navangelvel@gmail.com', 
      subject: `[Contacto Web] Prospecto: ${servicio}`,
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><strong>Nombre:</strong> ${nombre} ${apellidos}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: 'Enviado con éxito' }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error interno', error: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};